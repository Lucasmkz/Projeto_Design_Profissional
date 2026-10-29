import type { Aprovacao } from '@/types/ordem';

const ESTILOS: Record<Aprovacao, { texto: string; classe: string }> = {
  pendente: { texto: 'Aguardando resposta', classe: 'bg-amber-100 text-amber-900' },
  aprovado: { texto: 'Aprovado', classe: 'bg-emerald-100 text-emerald-900' },
  recusado: { texto: 'Recusado', classe: 'bg-zinc-200 text-zinc-800' },
};

export function SeloAprovacao({ aprovacao }: { aprovacao: Aprovacao }) {
  const { texto, classe } = ESTILOS[aprovacao];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${classe}`}>
      {texto}
    </span>
  );
}

export function SeloUrgencia({ urgente }: { urgente: boolean }) {
  return urgente ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-red-600" />
      Segurança
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-900">
      Pode aguardar
    </span>
  );
}
