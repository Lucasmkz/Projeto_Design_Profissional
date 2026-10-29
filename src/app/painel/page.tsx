'use client';

import { useState } from 'react';
import { Carregando } from '@/components/Carregando';
import { CardOrdem } from '@/components/CardOrdem';
import { useOrdens } from '@/context/OrdensContext';
import { useAgora } from '@/hooks/useAgora';
import { ROTULOS_STATUS } from '@/lib/formatadores';
import type { OrdemServico, StatusOS } from '@/types/ordem';

type Filtro = StatusOS | 'todos';

const ORDEM_EXIBICAO: StatusOS[] = [
  'aguardando_aprovacao',
  'pronto',
  'em_servico',
  'diagnostico',
  'recebido',
  'entregue',
];

function ordenar(a: OrdemServico, b: OrdemServico) {
  return ORDEM_EXIBICAO.indexOf(a.status) - ORDEM_EXIBICAO.indexOf(b.status);
}

export default function PainelPage() {
  const { ordens, restaurarDados, carregado } = useOrdens();
  const agora = useAgora();
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [confirmandoRestauracao, setConfirmandoRestauracao] = useState(false);

  if (!carregado) return <Carregando />;

  const contar = (status: StatusOS) => ordens.filter((o) => o.status === status).length;
  const resumo = [
    { rotulo: 'Carros no pátio', valor: ordens.filter((o) => o.status !== 'entregue').length, destaque: false },
    { rotulo: 'Aguardando aprovação', valor: contar('aguardando_aprovacao'), destaque: true },
    { rotulo: 'Em serviço', valor: contar('em_servico'), destaque: false },
    { rotulo: 'Prontos', valor: contar('pronto'), destaque: false },
  ];

  const visiveis = ordens.filter((o) => filtro === 'todos' || o.status === filtro).sort(ordenar);
  const opcoesFiltro: Filtro[] = ['todos', ...ORDEM_EXIBICAO];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Ordens de serviço</h1>
          <p className="text-sm text-zinc-600">5 elevadores · atualize o status e acompanhe as respostas dos clientes.</p>
        </div>

        {confirmandoRestauracao ? (
          <div className="flex items-center gap-2 text-sm" role="group" aria-label="Confirmar restauração">
            <span className="text-zinc-700">Apagar as alterações e voltar aos dados iniciais?</span>
            <button
              type="button"
              onClick={() => {
                restaurarDados();
                setConfirmandoRestauracao(false);
              }}
              className="rounded-lg bg-zinc-900 px-3 py-2 font-semibold text-white hover:bg-zinc-700"
            >
              Sim, restaurar
            </button>
            <button
              type="button"
              onClick={() => setConfirmandoRestauracao(false)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmandoRestauracao(true)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            Restaurar dados de demonstração
          </button>
        )}
      </div>

      <section aria-label="Resumo do pátio" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {resumo.map((card) => (
          <div
            key={card.rotulo}
            className={`rounded-2xl p-4 ${card.destaque ? 'bg-zinc-900 text-white' : 'border border-zinc-200 bg-white text-zinc-900'}`}
          >
            <p className={`text-sm ${card.destaque ? 'text-zinc-300' : 'text-zinc-600'}`}>{card.rotulo}</p>
            <p className={`mt-1 text-3xl font-bold ${card.destaque ? 'text-orange-400' : ''}`}>{card.valor}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="titulo-lista" className="space-y-4">
        <h2 id="titulo-lista" className="sr-only">
          Lista de ordens
        </h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
          {opcoesFiltro.map((opcao) => {
            const ativo = filtro === opcao;
            return (
              <button
                key={opcao}
                type="button"
                aria-pressed={ativo}
                onClick={() => setFiltro(opcao)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  ativo
                    ? 'bg-orange-500 text-zinc-900'
                    : 'border border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400'
                }`}
              >
                {opcao === 'todos' ? 'Todos' : ROTULOS_STATUS[opcao]}
              </button>
            );
          })}
        </div>

        {visiveis.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visiveis.map((ordem) => (
              <CardOrdem key={ordem.codigo} ordem={ordem} agora={agora} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-600">
            Nenhuma ordem com esse status.
          </p>
        )}
      </section>
    </div>
  );
}
