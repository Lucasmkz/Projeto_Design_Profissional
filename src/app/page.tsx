import Link from 'next/link';
import { FormularioCodigo } from '@/components/FormularioCodigo';
import { Marca } from '@/components/Marca';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-zinc-900">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pt-8 pb-6">
        <Marca />

        <section className="mt-12">
          <h1 className="text-3xl font-bold leading-tight text-white">
            Acompanhe o conserto do seu carro
          </h1>
          <p className="mt-3 text-zinc-300">
            Use o código que a oficina enviou pelo WhatsApp para ver em que etapa está o serviço,
            conferir as fotos das peças e aprovar o orçamento item por item.
          </p>
        </section>

        <section className="mt-8 rounded-2xl bg-white p-5 shadow-lg">
          <FormularioCodigo />
          <p className="mt-4 text-center text-sm text-zinc-600">
            Para testar: <span className="font-mono font-semibold text-zinc-900">VLZ-1042</span>
          </p>
        </section>

        <ul className="mt-8 space-y-3 text-sm text-zinc-300">
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
            Status atualizado pela própria equipe, sem precisar ligar.
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
            Foto e explicação simples de cada peça indicada.
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
            Você decide o que fazer agora e o que pode esperar.
          </li>
        </ul>

        <footer className="mt-auto pt-10 text-center">
          <Link
            href="/painel"
            className="text-sm text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline"
          >
            Acesso da oficina
          </Link>
        </footer>
      </div>
    </main>
  );
}
