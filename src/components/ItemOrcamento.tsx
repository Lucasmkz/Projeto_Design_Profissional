'use client';

import Image from 'next/image';
import { useState } from 'react';
import { SeloAprovacao, SeloUrgencia } from '@/components/SeloAprovacao';
import { formatarMoeda } from '@/lib/formatadores';
import type { Aprovacao, ItemOrcamento as Item } from '@/types/ordem';

interface Props {
  item: Item;
  podeResponder: boolean;
  onResponder: (aprovacao: Aprovacao) => void;
}

export function ItemOrcamento({ item, podeResponder, onResponder }: Props) {
  const [editando, setEditando] = useState(false);
  const mostrarBotoes = podeResponder && (item.aprovacao === 'pendente' || editando);

  function responder(aprovacao: Aprovacao) {
    onResponder(aprovacao);
    setEditando(false);
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      {item.fotoUrl && (
        <a href={item.fotoUrl} target="_blank" rel="noreferrer" className="block bg-zinc-100">
          <Image
            src={item.fotoUrl}
            alt={`Foto: ${item.descricao}`}
            width={240}
            height={180}
            unoptimized
            className="mx-auto h-40 w-auto"
          />
          <span className="sr-only">Abrir foto em tamanho maior</span>
        </a>
      )}

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <SeloUrgencia urgente={item.urgente} />
          <span className="text-xs text-zinc-600">{item.tipo === 'peca' ? 'Peça' : 'Mão de obra'}</span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-zinc-900">{item.descricao}</h3>
          <p className="shrink-0 font-bold text-zinc-900">{formatarMoeda(item.valor)}</p>
        </div>

        <p className="text-sm leading-relaxed text-zinc-700">{item.justificativa}</p>

        {mostrarBotoes ? (
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => responder('recusado')}
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={() => responder('aprovado')}
                className="rounded-xl bg-orange-500 px-3 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Aprovar
              </button>
            </div>
            {editando && (
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="w-full text-center text-sm text-zinc-600 underline-offset-4 hover:underline"
              >
                Cancelar
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 border-t border-zinc-100 pt-3">
            <SeloAprovacao aprovacao={item.aprovacao} />
            {podeResponder && (
              <button
                type="button"
                onClick={() => setEditando(true)}
                className="text-sm font-medium text-orange-700 underline-offset-4 hover:underline"
              >
                Alterar resposta
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
