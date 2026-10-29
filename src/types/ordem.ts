export type StatusOS =
  | 'recebido'
  | 'diagnostico'
  | 'aguardando_aprovacao'
  | 'em_servico'
  | 'pronto'
  | 'entregue';

export type Aprovacao = 'pendente' | 'aprovado' | 'recusado';

export interface ItemOrcamento {
  id: string;
  descricao: string;
  tipo: 'peca' | 'mao_de_obra';
  valor: number;
  justificativa: string;
  fotoUrl?: string;
  urgente: boolean;
  aprovacao: Aprovacao;
}

export interface EventoHistorico {
  status: StatusOS;
  data: string;
  observacao?: string;
}

export interface OrdemServico {
  codigo: string;
  cliente: { nome: string; telefone: string };
  veiculo: { modelo: string; placa: string; ano: number };
  mecanico: string;
  elevador: number;
  status: StatusOS;
  previsaoEntrega: string;
  historico: EventoHistorico[];
  itens: ItemOrcamento[];
}
