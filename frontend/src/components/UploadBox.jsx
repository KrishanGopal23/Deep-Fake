import { useRef, useState } from 'react';

function UploadBox({ onFileSelect, disabled }) {
  const inputRef = useRef(null);
  const dragDepthRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const openFilePicker = () => {
    if (disabled) {
      return;
    }

    inputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      onFileSelect(file);
    }

    event.target.value = '';
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) {
      return;
    }

    dragDepthRef.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) {
      return;
    }

    dragDepthRef.current -= 1;

    if (dragDepthRef.current <= 0) {
      dragDepthRef.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) {
      return;
    }

    dragDepthRef.current = 0;
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="mt-8">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={openFilePicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openFilePicker();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group rounded-[2rem] border border-dashed p-8 transition duration-300 ${
          isDragging
            ? 'scale-[1.01] border-sky-400/70 bg-sky-100/80 shadow-glow'
            : 'border-sky-200 bg-white/80 hover:border-sky-300 hover:bg-sky-50/90'
        } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300 text-slate-950 shadow-glow transition duration-300 group-hover:scale-105">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M12 16V5m0 0-4 4m4-4 4 4M5 16.5v1.75A1.75 1.75 0 0 0 6.75 20h10.5A1.75 1.75 0 0 0 19 18.25V16.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="mt-5 font-display text-2xl font-semibold text-slate-900">
            Drop image here
          </p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
            Drag and drop or tap to upload.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm text-slate-600">
              PNG, JPG, WEBP
            </span>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openFilePicker();
              }}
              disabled={disabled}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Choose File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadBox;
