import { Upload, X } from "lucide-react";

interface ImageUploadGridProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export default function ImageUploadGrid({ images, onChange, max = 6 }: ImageUploadGridProps) {
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = max - images.length;
    Array.from(files)
      .slice(0, remaining)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => onChange([...images, reader.result as string]);
        reader.readAsDataURL(file);
      });
  };

  const removeAt = (idx: number) => onChange(images.filter((_, i) => i !== idx));

  return (
    <div className="flex flex-wrap gap-2">
      {images.map((src, idx) => (
        <div key={idx} className="relative h-16 w-16 overflow-hidden rounded-lg border border-border">
          <img src={src} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => removeAt(idx)}
            className="absolute right-0.5 top-0.5 rounded-full bg-secondary-dark/70 p-0.5 text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      {images.length < max && (
        <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-dark text-text-muted hover:bg-background">
          <Upload className="h-4 w-4" />
          <span className="text-[10px]">Add</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </label>
      )}
    </div>
  );
}