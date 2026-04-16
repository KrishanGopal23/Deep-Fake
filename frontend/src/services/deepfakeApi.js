import { fileToDataUrl } from '../utils/file';

const DEFAULT_API_BASE_URL = 'https://krishangopal23-deepfake-detector.hf.space';

const API_BASE_URL = (
  import.meta.env.VITE_DEEPFAKE_API_BASE || DEFAULT_API_BASE_URL
).replace(/\/+$/, '');

const PREDICT_ENDPOINTS = [
  {
    kind: 'legacy-run',
    url: `${API_BASE_URL}/run/predict`,
  },
  {
    kind: 'gradio-call',
    url: `${API_BASE_URL}/gradio_api/call/predict`,
  },
];

function buildImagePayload(file, dataUrl) {
  return {
    url: dataUrl,
    orig_name: file.name,
    size: file.size,
    mime_type: file.type || 'image/png',
    is_stream: false,
    meta: {
      _type: 'gradio.FileData',
    },
  };
}

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function parseServerSentEvents(sseText) {
  const eventBlocks = sseText.split(/\n\n+/);
  let latestEvent = null;
  let latestPayload = null;

  for (const block of eventBlocks) {
    const eventMatch = block.match(/^event:\s*(.+)$/m);
    const dataMatches = [...block.matchAll(/^data:\s*(.+)$/gm)].map(
      (match) => match[1],
    );

    if (dataMatches.length) {
      latestEvent = eventMatch?.[1] ?? null;
      latestPayload = dataMatches.join('\n');
    }
  }

  if (!latestPayload) {
    throw new Error('Prediction completed without a readable result payload.');
  }

  try {
    return {
      event: latestEvent,
      payload: JSON.parse(latestPayload),
    };
  } catch {
    return {
      event: latestEvent,
      payload: latestPayload,
    };
  }
}

function extractPredictionValue(payload) {
  if (!payload) {
    return null;
  }

  if (typeof payload === 'string') {
    return payload;
  }

  if (Array.isArray(payload) && payload.length > 0) {
    return payload[0];
  }

  if (Array.isArray(payload.data) && payload.data.length > 0) {
    return payload.data[0];
  }

  if (typeof payload.prediction === 'string') {
    return payload.confidence
      ? `${payload.prediction} (${payload.confidence}%)`
      : payload.prediction;
  }

  return null;
}

function parsePredictionResult(rawValue) {
  if (typeof rawValue !== 'string' || !rawValue.trim()) {
    throw new Error('The API returned an unexpected prediction format.');
  }

  const normalizedValue = rawValue.trim();
  const predictionMatch = normalizedValue.match(/\b(real|fake)\b/i);
  const confidenceMatch = normalizedValue.match(/(\d+(?:\.\d+)?)\s*%/i);

  if (!predictionMatch) {
    throw new Error('The API response did not contain a Real/Fake prediction.');
  }

  const prediction =
    predictionMatch[1].charAt(0).toUpperCase() +
    predictionMatch[1].slice(1).toLowerCase();

  return {
    prediction,
    confidence: confidenceMatch
      ? Number.parseFloat(confidenceMatch[1])
      : null,
    rawLabel: normalizedValue,
  };
}

async function getQueuedPredictionResult(eventId) {
  const response = await fetch(`${API_BASE_URL}/gradio_api/call/predict/${eventId}`, {
    headers: {
      Accept: 'text/event-stream',
    },
  });

  if (!response.ok) {
    throw new Error('The API returned an error while retrieving the prediction result.');
  }

  const sseText = await response.text();
  const resultEvent = parseServerSentEvents(sseText);

  return parsePredictionResult(extractPredictionValue(resultEvent.payload));
}

export async function predictDeepfakeImage(file) {
  const dataUrl = await fileToDataUrl(file);
  const payload = {
    data: [buildImagePayload(file, dataUrl)],
  };

  let latestError = null;

  for (const endpoint of PREDICT_ENDPOINTS) {
    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await parseJsonSafely(response);

      if (!response.ok) {
        const errorMessage =
          responseBody?.error ||
          responseBody?.detail ||
          `The prediction request failed with status ${response.status}.`;

        latestError = new Error(errorMessage);

        if (endpoint.kind === 'legacy-run') {
          continue;
        }

        throw latestError;
      }

      if (endpoint.kind === 'legacy-run') {
        const legacyPrediction = extractPredictionValue(responseBody);

        if (!legacyPrediction) {
          latestError = new Error(
            'The prediction API returned an unexpected legacy response.',
          );
          continue;
        }

        return parsePredictionResult(legacyPrediction);
      }

      if (!responseBody?.event_id) {
        throw new Error('The prediction job started without an event id.');
      }

      return await getQueuedPredictionResult(responseBody.event_id);
    } catch (error) {
      latestError =
        error instanceof Error
          ? error
          : new Error('Unable to complete the prediction request.');

      if (endpoint.kind === 'legacy-run') {
        continue;
      }

      throw latestError;
    }
  }

  throw (
    latestError ||
    new Error('The hosted prediction API could not be reached from the app.')
  );
}

export { API_BASE_URL };

