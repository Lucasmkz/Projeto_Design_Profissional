'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Carregando } from '@/components/Carregando';
import { ItemOrcamento } from '@/components/ItemOrcamento';
import { LinhaDoTempo } from '@/components/LinhaDoTempo';
import { Marca } from '@/components/Marca';
import { ResumoOrcamento } from '@/components/ResumoOrcamento';
import { useOrdens } from '@/context/OrdensContext';
import { codigoDaUrl, formatarDataHora } from '@/lib/formatadores';
import { calcularTotais } from '@/lib/ordens';
import type { StatusOS } from '@/types/ordem';

// Depois que o serviço começa, mudanças no orçamento passam pela recepção.
const STATUS_QUE_ACEITAM_RESPOSTA: StatusOS[] = ['recebido', 'diagnostico', 'aguardando_aprovacao'];

export default function AcompanharPage() {
  const params = useParams<{ codigo: string }>();
  const codigo = codigoDaUrl(params.codigo);
  const { buscarOrdem, responderItem, carregado } = useOrdens();
  const ordem = buscarOrdem(codigo);

  if (!carregado) {
    return (
      <main className="flex-1 bg-zinc-900">
        <Carregando escuro />
      </main>
    );
  }

  if (!ordem) {
    return (
      <main className="flex flex-1 flex-col bg-zinc-900">
        <div className="mx-auto w-full max-w-md px-5 pt-8">
          <Marca />
          <section className="mt-12 rounded-2xl bg-white p-6 text-center">
            <h1 className="text-xl font-bold text-zinc-900">Não encontramos essa ordem</h1>
            <p className="mt-2 text-sm text-zinc-700">
              O código <span className="font-mono font-semibold">{codigo || '(vazio)'}</span> não
              corresponde a nenhum serviço. Confira se digitou igual à mensagem que você recebeu.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-zinc-900 transition hover:bg-orange-400"
            >
              Voltar e digitar outro código
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const podeResponder = STATUS_QUE_ACEITAM_RESPOSTA.includes(ordem.status);
  const { qtdPendentes } = calcularTotais(ordem.itens);
  const urgentesPrimeiro = [...ordem.itens].sort((a, b) => Number(b.urgente) - Number(a.urgente));

  return (
    <main className="flex-1 pb-10">
      <header className="bg-zinc-900 px-5 pt-6 pb-8 text-white">
        <div className="mx-auto max-w-md">
          <Marca subtitulo={`Ordem ${ordem.codigo}`} />
          <h1 className="mt-6 text-2xl font-bold">{ordem.veiculo.modelo}</h1>
          <p className="mt-1 text-zinc-300">
            {ordem.veiculo.ano} · Placa <span className="font-mono">{ordem.veiculo.placa}</span>
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-zinc-800 p-3">
              <dt className="text-zinc-400">Cliente</dt>
              <dd className="mt-0.5 font-medium">{ordem.cliente.nome}</dd>
            </div>
            <div className="rounded-xl bg-zinc-800 p-3">
              <dt className="text-zinc-400">Previsão de entrega</dt>
              <dd className="mt-0.5 font-medium">{formatarDataHora(ordem.previsaoEntrega)}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="mx-auto -mt-4 max-w-md space-y-6 px-4">
        {ordem.status === 'entregue' && (
          <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-900">
            Veículo entregue. Obrigado pela confiança!
          </p>
        )}

        <section aria-labelledby="titulo-andamento" className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 id="titulo-andamento" className="mb-4 font-bold text-zinc-900">
            Andamento do serviço
          </h2>
          <LinhaDoTempo ordem={ordem} />
        </section>

        {ordem.itens.length > 0 ? (
          <section aria-labelledby="titulo-orcamento" className="space-y-4">
            <div>
              <h2 id="titulo-orcamento" className="text-lg font-bold text-zinc-900">
                Orçamento
              </h2>
              {podeResponder && qtdPendentes > 0 && (
                <p className="mt-1 text-sm text-zinc-700">
                  Responda cada item. Os marcados como <strong>Segurança</strong> afetam freio,
                  suspensão ou motor e não devem esperar.
                </p>
              )}
            </div>

            <ResumoOrcamento itens={ordem.itens} />

            {qtdPendentes === 0 && (
              <p role="status" className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
                <strong>Tudo certo.</strong> A oficina já recebeu suas respostas e segue com o
                serviço a partir delas.
              </p>
            )}

            {!podeResponder && (
              <p className="text-sm text-zinc-600">
                O serviço já está em andamento. Para mudar alguma resposta, fale com a recepção.
              </p>
            )}

            {urgentesPrimeiro.map((item) => (
              <ItemOrcamento
                key={item.id}
                item={item}
                podeResponder={podeResponder}
                onResponder={(aprovacao) => responderItem(ordem.codigo, item.id, aprovacao)}
              />
            ))}
          </section>
        ) : (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-5 text-sm text-zinc-700">
            O mecânico ainda está avaliando o carro. Assim que o orçamento estiver pronto, ele
            aparece aqui com fotos e explicação de cada item.
          </p>
        )}
      </div>
    </main>
  );
}
