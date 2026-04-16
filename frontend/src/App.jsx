import { useEffect, useState } from 'react';
import ImagePreview from './components/ImagePreview';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import ResultCard from './components/ResultCard';
import UploadBox from './components/UploadBox';
import { predictDeepfakeImage } from './services/deepfakeApi';
import { isImageFile } from './utils/file';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [selectedFile]);

  const handleFileSelect = (file) => {
    if (!file) {
      return;
    }

    if (!isImageFile(file)) {
      setErrorMessage('Please upload a valid image file.');
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setErrorMessage('');
  };

  const handleClearImage = () => {
    if (isLoading) {
      return;
    }

    setSelectedFile(null);
    setResult(null);
    setErrorMessage('');
  };

  const handleAnalyzeImage = async () => {
    if (!selectedFile || isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setResult(null);

    try {
      const predictionResult = await predictDeepfakeImage(selectedFile);
      setResult(predictionResult);
    } catch (error) {
      const fallbackMessage =
        'We could not analyze that image right now. Please try again.';

      setErrorMessage(error instanceof Error ? error.message : fallbackMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-radial text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-5rem] top-16 h-64 w-64 rounded-full bg-sky-300/35 blur-3xl" />
        <div className="absolute right-[-5rem] top-10 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/40 blur-3xl" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-5xl items-center px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <section className="w-full">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Deepfake Detector AI
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
              Upload an image and get a clean real or fake prediction.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl rounded-[2.5rem] border border-white/70 bg-white/70 p-4 shadow-panel backdrop-blur-2xl sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[2rem] bg-gradient-to-b from-white via-sky-50/70 to-white p-5 sm:p-6">
                <UploadBox onFileSelect={handleFileSelect} disabled={isLoading} />

                {previewUrl ? (
                  <ImagePreview
                    file={selectedFile}
                    previewUrl={previewUrl}
                    onRemove={handleClearImage}
                    disabled={isLoading}
                  />
                ) : null}

                {errorMessage ? (
                  <div className="mt-5 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {errorMessage}
                  </div>
                ) : null}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleAnalyzeImage}
                    disabled={!selectedFile || isLoading}
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 px-6 py-4 font-semibold text-slate-950 shadow-glow transition duration-300 hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {isLoading ? 'Analyzing...' : 'Check Image'}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    disabled={!selectedFile || isLoading}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 font-medium text-slate-600 transition duration-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="rounded-[2rem] bg-gradient-to-b from-white via-pink-50/40 to-sky-50/60 p-5 sm:p-6">
                {isLoading ? (
                  <Loader />
                ) : result ? (
                  <ResultCard result={result} />
                ) : (
                  <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-sky-200 bg-white/75 p-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300 shadow-glow">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-8 w-8 text-slate-950"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          d="M5 12.5 9 16.5 19 7.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h2 className="mt-5 font-display text-2xl text-slate-900">
                      Result will appear here
                    </h2>
                    <p className="mt-3 text-sm text-slate-500">
                      Upload an image to begin.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
