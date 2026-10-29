import { useSyncExternalStore } from 'react';

const UM_MINUTO = 60_000;

function assinar(avisar: () => void) {
  const id = setInterval(avisar, UM_MINUTO / 2);
  return () => clearInterval(id);
}

const lerAgora = () => Math.floor(Date.now() / UM_MINUTO) * UM_MINUTO;

/** Hora atual arredondada ao minuto. No servidor é null, para não divergir na hidratação. */
export function useAgora(): number | null {
  return useSyncExternalStore(assinar, lerAgora, () => null);
}
