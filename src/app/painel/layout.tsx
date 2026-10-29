import Link from 'next/link';
import { Marca } from '@/components/Marca';

export default function PainelLayout({ children }: LayoutProps<'/painel'>) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Marca subtitulo="Painel da oficina" />
          <Link href="/painel" className="text-sm font-medium text-zinc-300 hover:text-white">
            Todas as ordens
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-6">{children}</main>
    </div>
  );
}
