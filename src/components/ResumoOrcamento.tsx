import { formatarMoeda } from '@/lib/formatadores';
import { calcularTotais } from '@/lib/ordens';
import type { ItemOrcamento } from '@/types/ordem';

export function ResumoOrcamento({ itens }: { itens: ItemOrcamento[] }) {
  const totais = calcularTotais(itens);

  return (
    <dl className="grid grid-cols-3 gap-2 text-center">
      <div className="rounded-xl bg-emerald-50 px-2 py-3">
        <dt className="text-xs font-medium text-emerald-800">Aprovado</dt>
        <dd className="mt-1 text-sm font-bold text-emerald-900">{formatarMoeda(totais.aprovado)}</dd>
      </div>
      <div className="rounded-xl bg-amber-50 px-2 py-3">
        <dt className="text-xs font-medium text-amber-800">Pendente</dt>
        <dd className="mt-1 text-sm font-bold text-amber-900">{formatarMoeda(totais.pendente)}</dd>
      </div>
      <div className="rounded-xl bg-zinc-100 px-2 py-3">
        <dt className="text-xs font-medium text-zinc-700">Recusado</dt>
        <dd className="mt-1 text-sm font-bold text-zinc-800">{formatarMoeda(totais.recusado)}</dd>
      </div>
    </dl>
  );
}
