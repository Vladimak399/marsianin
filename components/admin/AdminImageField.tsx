'use client';

import { ChangeEvent, useRef, useState } from 'react';

const FALLBACK_PREVIEW = '/images/mock/breakfast-card.svg';
const IMAGE_FORMAT_HINT = 'рекомендуется 4:3: 1200×900 или 1600×1200, jpg/png/webp/avif до 5 мб';

export default function AdminImageField({
  value,
  onChange,
  onUpload
}: {
  value: string;
  onChange: (nextValue: string) => void;
  onUpload: (file: File) => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewSrc, setPreviewSrc] = useState(value.trim() || FALLBACK_PREVIEW);

  const normalizedValue = value.trim();

  const handleTextChange = (nextValue: string) => {
    onChange(nextValue);
    setPreviewSrc(nextValue.trim() || FALLBACK_PREVIEW);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    await onUpload(file);
  };

  return (
    <div className="grid gap-2 md:grid-cols-[112px_1fr]">
      <div className="overflow-hidden border border-black/[0.08] bg-[#fffdf8]">
        <div className="relative aspect-[4/3] w-full bg-white">
          <img
            src={previewSrc}
            alt="превью изображения"
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => {
              if (previewSrc !== FALLBACK_PREVIEW) setPreviewSrc(FALLBACK_PREVIEW);
            }}
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex gap-2">
          <input
            value={value}
            onChange={(event) => handleTextChange(event.target.value)}
            className="w-full border border-black/[0.1] px-3 py-2 text-sm"
            placeholder="/images/menu/dish-name.webp или Blob URL"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32]"
            title="загрузить фото"
          >
            +
          </button>
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="hidden" onChange={(event) => void handleFileChange(event)} />
        </div>
        <p className="text-[11px] leading-relaxed text-black/42">{IMAGE_FORMAT_HINT}</p>
        {normalizedValue ? <p className="break-all text-[10px] leading-relaxed text-black/30">текущий путь: {normalizedValue}</p> : null}
      </div>
    </div>
  );
}
