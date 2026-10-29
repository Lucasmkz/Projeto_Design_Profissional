import Link from 'next/link';
import { BadgeStatus } from '@/components/BadgeStatus';
import { tempoRelativo } from '@/lib/formatadores';
import { calcularTotais, ultimoEvento } from '@/lib/ordens';
import type { OrdemServico } from '@/types/ordem';

export function CardOrdem({ ordem, agora }: { ordem: OrdemServico; agora: number | null }) {
  const aguardando = ordem.status === 'aguardando_aprovacao';
  const inicioEspera = aguardando ? ultimoEvento(ordem, 'aguardando_aprovacao') : undefined;
  const { qtdPendentes } = calcularTotais(ordem.itens);

  return (
    <Link
      href={`/painel/${ordem.codigo}`}
      className={`block rounded-2xl border bg-white p-4 transition hover:border-orange-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
        aguardando ? 'border-amber-300' : 'border-zinc-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold text-zinc-600">{ordem.codigo}</p>
          <h3 className="font-semibold text-zinc-900">{ordem.veiculo.modelo}</h3>
        </div>
        <BadgeStatus status={ordem.status} />
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-xs text-zinc-500">Placa</dt>
          <dd className="font-mono font-medium text-zinc-900">{ordem.veiculo.placa}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Elevador</dt>
          <dd className="font-medium text-zinc-900">{ordem.elevador}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-zinc-500">Mecânico</dt>
          <dd className="font-medium text-zinc-900">{ordem.mecanico}</dd>
        </div>
      </dl>

      {inicioEspera && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Esperando o cliente{agora !== null && ` ${tempoRelativo(inicioEspera.data, agora)}`}
          {qtdPendentes > 0 && ` · ${qtdPendentes} ${qtdPendentes === 1 ? 'item pendente' : 'itens pendentes'}`}
          {qtdPendentes === 0 && ordem.itens.length > 0 && ' · cliente já respondeu tudo'}
        </p>
      )}
    </Link>
  );
}
