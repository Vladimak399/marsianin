import { PropsWithChildren } from 'react';
import Link from 'next/link';

type PrimaryButtonProps = PropsWithChildren<{
  href: string;
}>;

export default function PrimaryButton({ href, children }: PrimaryButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center justify-center border border-black/[0.065] bg-white/78 px-5 py-3 text-sm font-medium tracking-[0.08em] text-[#403e3e] backdrop-blur-sm transition hover:border-[#ed6a32]/45 hover:text-[#ed6a32]"
    >
      {children}
    </Link>
  );
}
