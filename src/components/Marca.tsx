import Link from 'next/link';

export function Marca({ subtitulo }: { subtitulo?: string }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-orange-400">
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-lg bg-orange-500 text-lg font-black text-zinc-900"
      >
        V
      </span>
      <span className="leading-tight">
        <span className="block font-bold tracking-tight text-white">Auto Center Veloz</span>
        {subtitulo && <span className="block text-xs text-zinc-400">{subtitulo}</span>}
      </span>
    </Link>
  );
}
