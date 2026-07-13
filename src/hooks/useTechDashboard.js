import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { getSseUrl } from '../services/sse';

export function useTechDashboard(user, logoutContext, navigate) {
  const [tickets, setTickets] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null });
  const [promptModal, setPromptModal] = useState({ show: false, title: '', placeholder: '', inputValue: '', onConfirm: null, isPassword: false, allowEmpty: false });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000); 
  };

  const fetchData = useCallback(async () => {
    try {
      const [eqRes, tkRes, usRes] = await Promise.all([
        api.get('/equipments'), api.get('/tickets'), api.get('/users')
      ]);
      setEquipments(eqRes.data);
      setTickets(tkRes.data);
      setUsersList(usRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const sse = new EventSource(getSseUrl());
    sse.onmessage = (e) => {
      const payload = JSON.parse(e.data);
      if (payload?.action === 'RELOAD_DATA') fetchData();
      if (payload?.action === 'FORCE_LOGOUT' && payload.userId === user?.id) {
        logoutContext(); navigate('/');
      }
    };
    return () => sse.close();
  }, [fetchData, user, logoutContext, navigate]);

  const handleAssumirChamado = async (ticketId) => {
    try {
      await api.patch(`/tickets/${ticketId}/assign`, { tecnico_id: user.id });
      showToast('Chamado atribuído a você com sucesso!', 'success');
    } catch (err) {
      showToast("Erro ao assumir: " + (err.response?.data?.error || err.message), 'error');
    }
  };

  const handleAtualizarStatus = async (ticketId, novoStatus) => {
    if (['Concluído', 'Aguardando Confirmação'].includes(novoStatus)) {
      setPromptModal({
        show: true,
        title: 'Concluir Chamado',
        placeholder: 'Informe uma observação da solução aplicada...',
        inputValue: '',
        isPassword: false,
        allowEmpty: true,
        onConfirm: async (resolucao) => {
          try {
            await api.patch(`/tickets/${ticketId}/status`, { status_chamado: 'Aguardando Confirmação', resolucao_ti: resolucao || '' });
            showToast('Chamado enviado para avaliação do usuário!', 'success');
            fetchData();
          } catch (e) { showToast('Erro: ' + (e.response?.data?.error || e.message), 'error'); }
        }
      });
    } else if (novoStatus === 'Baixa') {
      setPromptModal({
        show: true, title: 'Justificativa de Baixa', placeholder: 'Informe o motivo técnico...', inputValue: '', isPassword: false, allowEmpty: false,
        onConfirm: async (motivo) => {
          try {
            await api.patch(`/tickets/${ticketId}/status`, { status_chamado: novoStatus, resolucao_ti: motivo });
            showToast('Equipamento baixado com sucesso!', 'success'); fetchData();
          } catch (e) { showToast("Erro: " + e.response?.data?.error, 'error'); }
        }
      });
    }
  };

  // NOSSOS FILTROS SEPARADOS
  const chamadosLivres = tickets.filter(tk => tk.tecnico_id === null && tk.status_chamado === 'Aberto');
  const meusChamados = tickets.filter(tk => tk.tecnico_id === user.id && tk.status_chamado === 'Em Andamento');
  
  // NOVO: Filtrando os resolvidos ou aguardando confirmação pelo técnico logado, ordenados do mais recente pro mais antigo (Top 5)
  const historicoRecente = tickets
    .filter(tk => tk.tecnico_id === user?.id && ['Aguardando Confirmação', 'Concluído', 'Baixa'].includes(tk.status_chamado))
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return {
    equipments, usersList, loading, showProfileModal, setShowProfileModal,
    confirmModal, setConfirmModal, promptModal, setPromptModal, toast, setToast, showToast,
    chamadosLivres, meusChamados, historicoRecente, // <-- EXPORTADO AQUI
    handleAssumirChamado, handleAtualizarStatus
  };
}
