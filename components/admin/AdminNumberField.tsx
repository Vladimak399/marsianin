'use client';

import { useEffect, useState } from 'react';

export default function AdminNumberField({
  value,
  onChange,
  className = '',
  placeholder,
  ariaLabel
}: {
  value: number;
  onChange: (nextValue: number) => void;
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
}) {
  const [displayValue, setDisplayValue] = useState(String(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) setDisplayValue(String(value));
  }, [isFocused, value]);

  const handleChange = (nextValue: string) => {
    if (!/^\d*$/.test(nextValue)) return;

    setDisplayValue(nextValue);
    onChange(nextValue === '' ? 0 : Number(nextValue));
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={displayValue}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false);
        if (displayValue === '') setDisplayValue('0');
      }}
      onChange={(event) => handleChange(event.target.value)}
      className={className}
    />
  );
}
