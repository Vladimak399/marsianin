'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';

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
  const normalizedValue = value.trim();
  const [previewSrc, setPreviewSrc] = useState(normalizedValue || FALLBACK_PREVIEW);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setPreviewSrc(normalizedValue || FALLBACK_PREVIEW);
  }, [normalizedValue]);

  const handleTextChange = (nextValue: string) => {
    onChange(nextValue);
    setPreviewSrc(nextValue.trim() || FALLBACK_PREVIEW);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || isUploading) return;

    setIsUploading(true);
    try {
      await onUpload(file);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid gap-2 md:grid-cols-[112px_1fr]">
      <div className="overflow-hidden border border-black/[0.08] bg-[#fffdf8]">
        <div className="relative aspect-[4/3] w-full bg-white">
          <img
            src={previewSrc}
            alt="превью изображения"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity ${isUploading ? 'opacity-45' : 'opacity-100'}`}
            onError={() => {
              if (previewSrc !== FALLBACK_PREVIEW) setPreviewSrc(FALLBACK_PREVIEW);
            }}
          />
          {isUploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/58 text-[10px] tracking-[0.08em] text-[#ed6a32]">
              загружаем
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex gap-2">
          <input
            value={value}
            onChange={(event) => handleTextChange(event.target.value)}
            disabled={isUploading}
            className="w-full border border-black/[0.1] px-3 py-2 text-sm disabled:cursor-progress disabled:opacity-60"
            placeholder="/images/menu/dish-name.webp или Blob URL"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="border border-black/[0.1] px-3 py-2 text-sm hover:border-[#ed6a32] hover:text-[#ed6a32] disabled:cursor-progress disabled:opacity-50"
            title="загрузить фото"
          >
            {isUploading ? '...' : '+'}
          </button>
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="hidden" onChange={(event) => void handleFileChange(event)} />
        </div>
        <p className="text-[11px] leading-relaxed text-black/42">{isUploading ? 'файл загружается в Vercel Blob, дождитесь завершения' : IMAGE_FORMAT_HINT}</p>
        {normalizedValue ? <p className="break-all text-[10px] leading-relaxed text-black/30">текущий путь: {normalizedValue}</p> : null}
      </div>
    </div>
  );
}
