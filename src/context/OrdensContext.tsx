'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ordensIniciais } from '@/data/ordens';
import type { Aprovacao, OrdemServico, StatusOS } from '@/types/ordem';

const CHAVE_STORAGE = 'autocenter-veloz:ordens';

interface OrdensContextValor {
  ordens: OrdemServico[];
  // Fica true depois que os dados salvos no navegador foram lidos.
  carregado: boolean;
  buscarOrdem: (codigo: string) => OrdemServico | undefined;
  responderItem: (codigo: string, itemId: string, aprovacao: Aprovacao) => void;
  atualizarStatus: (codigo: string, status: StatusOS, observacao?: string) => void;
  restaurarDados: () => void;
}

const OrdensContext = createContext<OrdensContextValor | null>(null);

function lerOrdensSalvas(): OrdemServico[] | null {
  try {
    const salvo = localStorage.getItem(CHAVE_STORAGE);
    return salvo ? (JSON.parse(salvo) as OrdemServico[]) : null;
  } catch {
    return null;
  }
}

export function OrdensProvider({ children }: { children: React.ReactNode }) {
  const [{ ordens, carregado }, setEstado] = useState({
    ordens: ordensIniciais,
    carregado: false,
  });

  const setOrdens = useCallback((atualizar: (atuais: OrdemServico[]) => OrdemServico[]) => {
    setEstado((estado) => ({ ...estado, ordens: atualizar(estado.ordens) }));
  }, []);

  // Lê o localStorage só no navegador, depois da hidratação.
  useEffect(() => {
    // Leitura única de um sistema externo; fazer isso no render quebraria a hidratação.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEstado((estado) => ({ ordens: lerOrdensSalvas() ?? estado.ordens, carregado: true }));
  }, []);

  // Só salva depois de carregar, para não sobrescrever o que já estava gravado.
  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(ordens));
    } catch {
      // Sem localStorage (modo privado, por exemplo) o app segue só em memória.
    }
  }, [ordens, carregado]);

  const buscarOrdem = useCallback(
    (codigo: string) => ordens.find((ordem) => ordem.codigo === codigo.toUpperCase()),
    [ordens],
  );

  const responderItem = useCallback((codigo: string, itemId: string, aprovacao: Aprovacao) => {
    setOrdens((atuais) =>
      atuais.map((ordem) =>
        ordem.codigo !== codigo
          ? ordem
          : {
              ...ordem,
              itens: ordem.itens.map((item) => (item.id === itemId ? { ...item, aprovacao } : item)),
            },
      ),
    );
  }, [setOrdens]);

  const atualizarStatus = useCallback((codigo: string, status: StatusOS, observacao?: string) => {
    const texto = observacao?.trim();
    setOrdens((atuais) =>
      atuais.map((ordem) =>
        ordem.codigo !== codigo
          ? ordem
          : {
              ...ordem,
              status,
              historico: [
                ...ordem.historico,
                { status, data: new Date().toISOString(), ...(texto ? { observacao: texto } : {}) },
              ],
            },
      ),
    );
  }, [setOrdens]);

  const restaurarDados = useCallback(() => {
    setOrdens(() => ordensIniciais);
  }, [setOrdens]);

  const valor = useMemo(
    () => ({ ordens, carregado, buscarOrdem, responderItem, atualizarStatus, restaurarDados }),
    [ordens, carregado, buscarOrdem, responderItem, atualizarStatus, restaurarDados],
  );

  return <OrdensContext.Provider value={valor}>{children}</OrdensContext.Provider>;
}

export function useOrdens(): OrdensContextValor {
  const contexto = useContext(OrdensContext);
  if (!contexto) {
    throw new Error('useOrdens precisa ser usado dentro de <OrdensProvider>.');
  }
  return contexto;
}
