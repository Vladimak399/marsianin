import { PropsWithChildren } from 'react';
import Link from 'next/link';

type PrimaryButtonProps = PropsWithChildren<{
  href: string;
}>;

export default function PrimaryButton({ href, children }: PrimaryButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center border border-accent bg-accent px-5 py-3 text-sm font-medium tracking-[0.06em] text-white transition-colors hover:bg-white hover:text-accent"
    >
      {children}
    </Link>
  );
}
