import type { EventoHistorico, ItemOrcamento, OrdemServico, StatusOS } from '@/types/ordem';

export function ultimoEvento(ordem: OrdemServico, status: StatusOS): EventoHistorico | undefined {
  return ordem.historico.findLast((evento) => evento.status === status);
}

export function calcularTotais(itens: ItemOrcamento[]) {
  const somar = (aprovacao: ItemOrcamento['aprovacao']) =>
    itens.filter((item) => item.aprovacao === aprovacao).reduce((total, item) => total + item.valor, 0);

  return {
    aprovado: somar('aprovado'),
    pendente: somar('pendente'),
    recusado: somar('recusado'),
    qtdPendentes: itens.filter((item) => item.aprovacao === 'pendente').length,
  };
}
