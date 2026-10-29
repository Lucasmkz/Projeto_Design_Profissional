import { formatarDiaHora, rotuloStatus } from '@/lib/formatadores';
import { ultimoEvento } from '@/lib/ordens';
import type { OrdemServico, StatusOS } from '@/types/ordem';

const ETAPAS: StatusOS[] = ['recebido', 'diagnostico', 'aguardando_aprovacao', 'em_servico', 'pronto'];

export function LinhaDoTempo({ ordem }: { ordem: OrdemServico }) {
  const indiceAtual = ordem.status === 'entregue' ? ETAPAS.length : ETAPAS.indexOf(ordem.status);

  return (
    <ol className="space-y-0">
      {ETAPAS.map((etapa, indice) => {
        const concluida = indice < indiceAtual;
        const atual = indice === indiceAtual;
        const evento = concluida || atual ? ultimoEvento(ordem, etapa) : undefined;
        const ultima = indice === ETAPAS.length - 1;

        return (
          <li key={etapa} className="relative flex gap-3 pb-5 last:pb-0">
            {!ultima && (
              <span
                aria-hidden
                className={`absolute top-7 left-[13px] h-[calc(100%-1.5rem)] w-0.5 ${
                  concluida ? 'bg-orange-500' : 'bg-zinc-200'
                }`}
              />
            )}
            <span
              aria-hidden
              className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-xs font-bold ${
                concluida
                  ? 'border-orange-500 bg-orange-500 text-zinc-900'
                  : atual
                    ? 'border-orange-500 bg-white text-orange-700 ring-4 ring-orange-500/20'
                    : 'border-zinc-300 bg-white text-zinc-400'
              }`}
            >
              {concluida ? '✓' : indice + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <p
                className={`text-sm ${
                  atual ? 'font-bold text-zinc-900' : concluida ? 'font-medium text-zinc-800' : 'text-zinc-500'
                }`}
              >
                {rotuloStatus(etapa)}
                {atual && <span className="sr-only"> (etapa atual)</span>}
              </p>
              {evento && <p className="text-xs text-zinc-600">{formatarDiaHora(evento.data)}</p>}
              {atual && evento?.observacao && (
                <p className="mt-1 text-sm text-zinc-700">{evento.observacao}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
