import { useState } from "react";

import { uploadImage } from "../../lib/adminApi";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  /** Si es true, quita el fondo en el navegador antes de subir (fotos de
   * producto). Si es false, sube la foto tal cual (fotos de campaña). */
  removeBackground?: boolean;
  multiple?: boolean;
  label?: string;
}

export default function ImageUploader({
  images,
  onChange,
  removeBackground = false,
  multiple = true,
  label = "Fotos",
}: ImageUploaderProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setProcessing(true);

    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        let toUpload: Blob = file;
        if (removeBackground) {
          const { removeBackground: removeBg } = await import("@imgly/background-removal");
          toUpload = await removeBg(file);
        }
        const url = await uploadImage(toUpload, file.name.replace(/\.[^.]+$/, ".png"));
        newUrls.push(url);
      }
      onChange([...images, ...newUrls]);
    } catch {
      setError("No pudimos procesar/subir la imagen. Intenta de nuevo.");
    } finally {
      setProcessing(false);
    }
  };

  const removeAt = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <p className="text-xs font-medium text-ink/60">{label}</p>

      <div className="mt-2 flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={url + i} className="relative h-24 w-24 overflow-hidden rounded-lg border border-ink/10">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Quitar imagen"
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-xs text-surface"
            >
              ×
            </button>
          </div>
        ))}

        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-ink/20 text-center text-xs text-ink/50 hover:border-ink/40 hover:bg-hero/10">
          {processing ? "Procesando…" : "Agregar"}
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            disabled={processing}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>

      {removeBackground && (
        <p className="mt-2 text-xs text-ink/40">
          El fondo se quita automáticamente al subir la foto (puede tardar unos segundos la primera vez).
        </p>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
