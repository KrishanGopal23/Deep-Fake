export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Unable to convert the image into a data URL.'));
    };

    reader.onerror = () => {
      reject(new Error('Unable to read the selected image.'));
    };

    reader.readAsDataURL(file);
  });
}

export function isImageFile(file) {
  if (!file) {
    return false;
  }

  if (typeof file.type === 'string' && file.type.startsWith('image/')) {
    return true;
  }

  return /\.(png|jpe?g|webp|bmp|gif|avif)$/i.test(file.name);
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const digits = value >= 10 || unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(digits)} ${units[unitIndex]}`;
}

