import { formatBytes } from '../utils/file';

function ImagePreview({ file, previewUrl, onRemove, disabled }) {
  return (
    <div className="mt-6 rounded-[2rem] border border-sky-100 bg-white/85 p-4 shadow-panel">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
            Preview
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {file.name} • {formatBytes(file.size)}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-500 transition duration-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Remove
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-[1.75rem] border border-sky-100 bg-slate-100">
        <img
          src={previewUrl}
          alt="Selected preview"
          className="h-[280px] w-full object-cover sm:h-[340px]"
        />
      </div>
    </div>
  );
}

export default ImagePreview;
