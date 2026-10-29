'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function normalizarCodigo(valor: string): string {
  return valor.toUpperCase().replace(/\s+/g, '');
}

export function FormularioCodigo() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');

  function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const normalizado = normalizarCodigo(codigo);
    if (!normalizado) {
      setErro('Digite o código que você recebeu da oficina.');
      return;
    }
    router.push(`/acompanhar/${encodeURIComponent(normalizado)}`);
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-3">
      <div className="space-y-1.5">
        <label htmlFor="codigo" className="block text-sm font-medium text-zinc-800">
          Código da ordem de serviço
        </label>
        <input
          id="codigo"
          name="codigo"
          value={codigo}
          onChange={(e) => {
            setCodigo(e.target.value);
            setErro('');
          }}
          placeholder="Ex.: VLZ-1042"
          autoComplete="off"
          autoCapitalize="characters"
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? 'codigo-erro' : undefined}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base uppercase text-zinc-900 placeholder:normal-case placeholder:text-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
        />
        {erro && (
          <p id="codigo-erro" className="text-sm text-red-700">
            {erro}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-orange-500 px-4 py-3 text-base font-semibold text-zinc-900 transition hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
      >
        Acompanhar
      </button>
    </form>
  );
}
