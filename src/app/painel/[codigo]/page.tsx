'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BadgeStatus } from '@/components/BadgeStatus';
import { Carregando } from '@/components/Carregando';
import { SeloAprovacao, SeloUrgencia } from '@/components/SeloAprovacao';
import { useOrdens } from '@/context/OrdensContext';
import { codigoDaUrl, formatarDataHora, formatarMoeda, ROTULOS_STATUS } from '@/lib/formatadores';
import { calcularTotais } from '@/lib/ordens';
import type { OrdemServico, StatusOS } from '@/types/ordem';

const TODOS_STATUS = Object.keys(ROTULOS_STATUS) as StatusOS[];

function FormularioStatus({
  ordem,
  onSalvar,
}: {
  ordem: OrdemServico;
  onSalvar: (status: StatusOS, observacao: string) => void;
}) {
  const [status, setStatus] = useState<StatusOS>(ordem.status);
  const [observacao, setObservacao] = useState('');

  function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    onSalvar(status, observacao);
  }

  return (
    <form onSubmit={enviar} className="space-y-3">
      <div className="space-y-1.5">
        <label htmlFor="status" className="block text-sm font-medium text-zinc-800">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusOS)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
        >
          {TODOS_STATUS.map((opcao) => (
            <option key={opcao} value={opcao}>
              {ROTULOS_STATUS[opcao]}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="observacao" className="block text-sm font-medium text-zinc-800">
          Observação para o histórico <span className="font-normal text-zinc-500">(opcional)</span>
        </label>
        <textarea
          id="observacao"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          rows={3}
          placeholder="Ex.: peças chegaram, carro subiu no elevador."
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-orange-500 px-4 py-2.5 font-semibold text-zinc-900 transition hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
      >
        Salvar atualização
      </button>
    </form>
  );
}

export default function DetalheOrdemPage() {
  const params = useParams<{ codigo: string }>();
  const codigo = codigoDaUrl(params.codigo);
  const { buscarOrdem, atualizarStatus, carregado } = useOrdens();
  const ordem = buscarOrdem(codigo);

  const [salvo, setSalvo] = useState(false);
  const [copia, setCopia] = useState<'ok' | 'falhou' | null>(null);
  const [linkCliente, setLinkCliente] = useState('');

  useEffect(() => {
    if (!salvo && copia !== 'ok') return;
    const id = setTimeout(() => {
      setSalvo(false);
      setCopia((atual) => (atual === 'ok' ? null : atual));
    }, 2500);
    return () => clearTimeout(id);
  }, [salvo, copia]);

  if (!carregado) return <Carregando />;

  if (!ordem) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-6 text-center">
        <h1 className="text-xl font-bold text-zinc-900">Ordem não encontrada</h1>
        <p className="mt-2 text-sm text-zinc-700">
          Não existe ordem com o código <span className="font-mono font-semibold">{codigo || '(vazio)'}</span>.
        </p>
        <Link
          href="/painel"
          className="mt-6 inline-block rounded-lg bg-orange-500 px-4 py-2.5 font-semibold text-zinc-900 hover:bg-orange-400"
        >
          Voltar para o painel
        </Link>
      </div>
    );
  }

  async function copiarLink(codigoOrdem: string) {
    const link = `${window.location.origin}/acompanhar/${codigoOrdem}`;
    setLinkCliente(link);
    try {
      await navigator.clipboard.writeText(link);
      setCopia('ok');
    } catch {
      setCopia('falhou');
    }
  }

  const totais = calcularTotais(ordem.itens);
  const historicoRecente = [...ordem.historico].reverse();

  return (
    <div className="space-y-6">
      <Link href="/painel" className="text-sm font-medium text-orange-700 hover:underline">
        ← Voltar para a lista
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl font-bold text-zinc-900">{ordem.codigo}</h1>
            <BadgeStatus status={ordem.status} />
          </div>
          <p className="mt-1 text-zinc-700">
            {ordem.veiculo.modelo} {ordem.veiculo.ano} · <span className="font-mono">{ordem.veiculo.placa}</span>
          </p>
        </div>
        <div className="text-right">
          <button
            type="button"
            onClick={() => copiarLink(ordem.codigo)}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              copia === 'ok' ? 'bg-emerald-600 text-white' : 'bg-zinc-900 text-white hover:bg-zinc-700'
            }`}
          >
            {copia === 'ok' ? 'Link copiado' : 'Copiar link do cliente'}
          </button>
          <p role="status" className="mt-1 max-w-xs text-xs text-zinc-600">
            {copia === 'falhou' && `Não foi possível copiar. Copie manualmente: ${linkCliente}`}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section aria-labelledby="titulo-dados" className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 id="titulo-dados" className="mb-4 font-bold text-zinc-900">
              Dados da ordem
            </h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-zinc-500">Cliente</dt>
                <dd className="font-medium text-zinc-900">{ordem.cliente.nome}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Telefone</dt>
                <dd className="font-medium text-zinc-900">{ordem.cliente.telefone}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Previsão de entrega</dt>
                <dd className="font-medium text-zinc-900">{formatarDataHora(ordem.previsaoEntrega)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Mecânico</dt>
                <dd className="font-medium text-zinc-900">{ordem.mecanico}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Elevador</dt>
                <dd className="font-medium text-zinc-900">{ordem.elevador}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="titulo-itens" className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="titulo-itens" className="font-bold text-zinc-900">
                Itens do orçamento
              </h2>
              {ordem.itens.length > 0 && (
                <p className="text-sm text-zinc-600">
                  Aprovado {formatarMoeda(totais.aprovado)} · Pendente {formatarMoeda(totais.pendente)} · Recusado{' '}
                  {formatarMoeda(totais.recusado)}
                </p>
              )}
            </div>
            {ordem.itens.length > 0 ? (
              <ul className="divide-y divide-zinc-100">
                {ordem.itens.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-900">{item.descricao}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <SeloUrgencia urgente={item.urgente} />
                        <span className="text-xs text-zinc-600">
                          {item.tipo === 'peca' ? 'Peça' : 'Mão de obra'} · {formatarMoeda(item.valor)}
                        </span>
                      </div>
                    </div>
                    <SeloAprovacao aprovacao={item.aprovacao} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-600">Nenhum item lançado. O diagnóstico ainda está em andamento.</p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section aria-labelledby="titulo-atualizar" className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 id="titulo-atualizar" className="mb-4 font-bold text-zinc-900">
              Atualizar status
            </h2>
            <FormularioStatus
              key={`${ordem.status}-${ordem.historico.length}`}
              ordem={ordem}
              onSalvar={(status, observacao) => {
                atualizarStatus(ordem.codigo, status, observacao);
                setSalvo(true);
              }}
            />
            <p role="status" className="mt-2 text-center text-sm font-medium text-emerald-700">
              {salvo && 'Atualização salva'}
            </p>
          </section>

          <section aria-labelledby="titulo-historico" className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 id="titulo-historico" className="mb-4 font-bold text-zinc-900">
              Histórico
            </h2>
            <ol className="space-y-4">
              {historicoRecente.map((evento, indice) => (
                <li key={`${evento.data}-${indice}`} className="border-l-2 border-orange-500 pl-3">
                  <p className="text-sm font-semibold text-zinc-900">{ROTULOS_STATUS[evento.status]}</p>
                  <p className="text-xs text-zinc-600">{formatarDataHora(evento.data)}</p>
                  {evento.observacao && <p className="mt-1 text-sm text-zinc-700">{evento.observacao}</p>}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
