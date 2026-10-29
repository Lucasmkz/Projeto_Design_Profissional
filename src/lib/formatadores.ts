import type { StatusOS } from '@/types/ordem';

// Fuso fixo para que servidor e navegador gerem o mesmo texto.
const FUSO = 'America/Sao_Paulo';

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const dataHora = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: FUSO,
});

const diaHora = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: FUSO,
});

export function formatarMoeda(valor: number): string {
  return moeda.format(valor);
}

export function formatarDataHora(iso: string): string {
  return dataHora.format(new Date(iso));
}

export function formatarDiaHora(iso: string): string {
  return diaHora.format(new Date(iso));
}

export const ROTULOS_STATUS: Record<StatusOS, string> = {
  recebido: 'Recebido',
  diagnostico: 'Em diagnóstico',
  aguardando_aprovacao: 'Aguardando aprovação',
  em_servico: 'Em serviço',
  pronto: 'Pronto para retirada',
  entregue: 'Entregue',
};

export function rotuloStatus(status: StatusOS): string {
  return ROTULOS_STATUS[status];
}

export function tempoRelativo(iso: string, agora: number = Date.now()): string {
  const minutos = Math.floor((agora - new Date(iso).getTime()) / 60000);

  if (minutos < 1) return 'agora mesmo';
  if (minutos < 60) return `há ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} h`;

  const dias = Math.floor(horas / 24);
  return dias === 1 ? 'há 1 dia' : `há ${dias} dias`;
}

/** Lê o código vindo da URL sem quebrar com codificação inválida. */
export function codigoDaUrl(valor: string | undefined): string {
  if (!valor) return '';
  try {
    return decodeURIComponent(valor).toUpperCase();
  } catch {
    return valor.toUpperCase();
  }
}
