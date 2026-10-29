import { rotuloStatus } from '@/lib/formatadores';
import type { StatusOS } from '@/types/ordem';

const CORES: Record<StatusOS, string> = {
  recebido: 'bg-zinc-100 text-zinc-800 ring-zinc-300',
  diagnostico: 'bg-sky-50 text-sky-900 ring-sky-200',
  aguardando_aprovacao: 'bg-amber-50 text-amber-900 ring-amber-300',
  em_servico: 'bg-orange-50 text-orange-900 ring-orange-300',
  pronto: 'bg-emerald-50 text-emerald-900 ring-emerald-300',
  entregue: 'bg-zinc-100 text-zinc-600 ring-zinc-200',
};

export function BadgeStatus({ status }: { status: StatusOS }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${CORES[status]}`}
    >
      {rotuloStatus(status)}
    </span>
  );
}
