import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { getSseUrl } from '../services/sse';

export function useAdminDashboard(user, logoutContext, navigate) {
  const [equipments, setEquipments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [novoEq, setNovoEq] = useState({ patrimonio: '', tipo: '', observacao: '' });

  const [alertModal, setAlertModal] = useState({ show: false, title: '', message: '', type: 'info' });
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null });
  const [promptModal, setPromptModal] = useState({ show: false, title: '', placeholder: '', inputValue: '', onConfirm: null, isPassword: false });

  const fetchData = useCallback(async () => {
    try {
      const [eqResponse, tkResponse, usResponse] = await Promise.all([
        api.get('/equipments'),
        api.get('/tickets'),
        api.get('/users')
      ]);
      setEquipments(eqResponse.data);
      setTickets(tkResponse.data);
      setUsersList(usResponse.data);
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
      
      // ESCUTA O GRITO DO BACKEND PARA DESLOGAR
      if (payload?.action === 'FORCE_LOGOUT' && payload.userId === user?.id) {
        alert('Sua sessão foi modificada ou encerrada pelo administrador.');
        logoutContext();
        navigate('/');
      }
    };
    return () => sse.close();
  }, [fetchData, user, logoutContext, navigate]);

  const showAlert = (title, message, type = 'info') => setAlertModal({ show: true, title, message, type });

  const handleDeletarEquipamentoManual = (id, patrimonio) => {
    setConfirmModal({
      show: true,
      title: 'Remover Patrimônio',
      message: `Tem certeza que deseja remover o equipamento de patrimônio número ${patrimonio}? O histórico de chamados continuará salvo.`,
      onConfirm: async () => {
        try {
          await api.delete(`/equipments/${id}`);
          showAlert('Sucesso', 'Equipamento removido com sucesso via soft-delete!', 'success');
          fetchData();
        } catch (err) { showAlert('Erro', err.response?.data?.error || 'Erro ao remover.', 'error'); }
      }
    });
  };

  const handleAlterarStatusChamado = (ticketId, statusAtual, novoStatus) => {
    if (statusAtual === novoStatus) return;

    if (novoStatus === 'Concluído') {
      setPromptModal({
        show: true, title: 'Finalizar Chamado', placeholder: 'Descreva a solução aplicada...', inputValue: '', isPassword: false,
        onConfirm: async (res) => {
          try {
            await api.patch(`/tickets/${ticketId}/status`, { status_chamado: novoStatus, resolucao_ti: res });
            showAlert('Sucesso', 'Chamado resolvido!', 'success');
            fetchData();
          } catch (error) { showAlert('Erro', error.response?.data?.error, 'error'); }
        }
      });
    } else if (novoStatus === 'Baixa') {
      setPromptModal({
        show: true, title: 'Justificativa de Baixa', placeholder: 'Informe o motivo técnico do descarte...', inputValue: '', isPassword: false,
        onConfirm: async (motivo) => {
          try {
            const ticketAlvo = tickets.find(t => t.id === ticketId);
            await api.patch(`/tickets/${ticketId}/status`, { status_chamado: novoStatus, resolucao_ti: motivo });
            if (ticketAlvo && ticketAlvo.equipment_id) await api.delete(`/equipments/${ticketAlvo.equipment_id}`); 
            showAlert('Sucesso', 'Equipamento baixado com sucesso.', 'success');
            fetchData();
          } catch (error) { showAlert('Erro', error.response?.data?.error, 'error'); }
        }
      });
    } else {
       api.patch(`/tickets/${ticketId}/status`, { status_chamado: novoStatus }).then(() => { fetchData(); });
    }
  };

  const handleCadastrarEquipamento = async (e) => {
    e.preventDefault();
    try {
      await api.post('/equipments', novoEq);
      setShowModal(false);
      showAlert('Sucesso', 'Cadastrado!', 'success');
      setNovoEq({ patrimonio: '', tipo: '', observacao: '' });
      fetchData();
    } catch (err) { showAlert('Erro', err.response?.data?.error, 'error'); }
  };

  return {
    equipments, tickets, usersList, loading, activeTab, setActiveTab, statusFilter, setStatusFilter,
    showModal, setShowModal, showProfileModal, setShowProfileModal, novoEq, setNovoEq,
    alertModal, setAlertModal, confirmModal, setConfirmModal, promptModal, setPromptModal,
    handleDeletarEquipamentoManual, handleAlterarStatusChamado, handleCadastrarEquipamento, showAlert, fetchData
  };
}