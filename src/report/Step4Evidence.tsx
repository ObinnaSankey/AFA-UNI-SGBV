import { useState, useRef } from 'react';
import { Upload, X, FileText, Image, Music, Video, AlertTriangle, SkipForward } from 'lucide-react';
import type { ReportFormData } from '../lib/types';

interface Props {
  data: ReportFormData;
  onChange: (data: Partial<ReportFormData>) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'audio/mpeg', 'video/mp4'];
const ALLOWED_EXTENSIONS = '.jpg, .jpeg, .png, .pdf, .mp3, .mp4';
const MAX_SIZE_MB = 10;
const MAX_FILES = 3;

function FileIcon({ type }: { type: string }) {
  if (type.startsWith('image')) return <Image className="w-4 h-4 text-teal-600" />;
  if (type.startsWith('audio')) return <Music className="w-4 h-4 text-amber-600" />;
  if (type.startsWith('video')) return <Video className="w-4 h-4 blue-600" />;
  return <FileText className="w-4 h-4 text-slate-600" />;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

export default function Step4Evidence({ data, onChange }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const errs: string[] = [];
    const newFiles: File[] = [...data.files];

    Array.from(incoming).forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errs.push(`"${file.name}" is not an allowed file type.`);
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        errs.push(`"${file.name}" exceeds the ${MAX_SIZE_MB}MB limit.`);
        return;
      }
      if (newFiles.length >= MAX_FILES) {
        errs.push(`Maximum ${MAX_FILES} files allowed.`);
        return;
      }
      if (!newFiles.find((f) => f.name === file.name && f.size === file.size)) {
        newFiles.push(file);
      }
    });

    setErrors(errs);
    onChange({ files: newFiles, skipEvidence: false });
  };

  const removeFile = (index: number) => {
    const updated = data.files.filter((_, i) => i !== index);
    onChange({ files: updated });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">Evidence upload (optional)</h2>
        <p className="text-sm text-slate-500 mb-4">
          You may attach evidence to support your report. This step is entirely optional.
        </p>
      </div>

      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800 mb-0.5">Safety first</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            Only upload evidence if it is safe and necessary to do so. Do not put yourself at risk to obtain evidence.
            Files are sent directly to the designated officer — not stored on public servers by default.
          </p>
        </div>
      </div>

      {!data.skipEvidence && (
        <>
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-150 cursor-pointer ${
              dragOver
                ? 'border-teal-500 bg-teal-50'
                : 'border-slate-300 bg-slate-50 hover:border-teal-400 hover:bg-teal-50/50'
            }`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
          >
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-700 mb-1">Drag & drop files here, or click to browse</p>
            <p className="text-xs text-slate-400">Allowed: {ALLOWED_EXTENSIONS} · Max {MAX_SIZE_MB}MB per file · Up to {MAX_FILES} files</p>
            <input
              ref={inputRef}
              type="file"
              accept={ALLOWED_EXTENSIONS}
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 space-y-1">
              {errors.map((e, i) => (
                <p key={i} className="text-xs text-red-700">{e}</p>
              ))}
            </div>
          )}

          {data.files.length > 0 && (
            <div className="space-y-2">
              {data.files.map((file, i) => (
                <div key={i} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3">
                  <FileIcon type={file.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 truncate">{file.name}</p>
                    <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onChange({ skipEvidence: !data.skipEvidence, files: [] })}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            data.skipEvidence ? 'text-teal-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            data.skipEvidence ? 'border-teal-600 bg-teal-600' : 'border-slate-300'
          }`}>
            {data.skipEvidence && <SkipForward className="w-3 h-3 text-white" />}
          </div>
          I cannot upload evidence now — skip this step
        </button>
        {data.skipEvidence && (
          <p className="text-xs text-slate-400 mt-1.5 ml-7">
            No problem. You can provide evidence directly to the Gender Center later using your Tracking ID.
          </p>
        )}
      </div>

      <div className="text-xs text-slate-400 bg-slate-50 rounded-xl p-3.5 leading-relaxed">
        Files are included in the secure email sent to your institution's designated officer. They are not publicly
        accessible. Max 3 files, 10MB each. Allowed types: JPG, PNG, PDF, MP3, MP4.
      </div>
    </div>
  );
}
