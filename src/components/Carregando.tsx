export function Carregando({ escuro = false }: { escuro?: boolean }) {
  return (
    <p role="status" className={`p-10 text-center text-sm ${escuro ? 'text-zinc-400' : 'text-zinc-600'}`}>
      Carregando…
    </p>
  );
}
