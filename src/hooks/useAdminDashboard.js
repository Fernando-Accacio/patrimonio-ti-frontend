import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { getSseUrl } from '../services/sse';

export function useAdminDashboard(user, logoutContext, navigate) {
  const [equipments, setEquipments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [resetRequests, setResetRequests] = useState([]); 
  const [resetHistory, setResetHistory] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('Todos');
  
  // Controles de Modais
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false); 
  
  // 🌟 NOVO: Controle do Modal de Devolução
  const [showDevolverModal, setShowDevolverModal] = useState(false);
  const [ticketParaDevolver, setTicketParaDevolver] = useState(null);

  // Payloads de novos cadastros
  const [novoEq, setNovoEq] = useState({ patrimonio: '', tipo: '', observacao: '' });
  const [novoUser, setNovoUser] = useState({ nome: '', email: '', matricula: '', role: 'USER' }); 

  // Modais de confirmação e Toast
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null });
  const [promptModal, setPromptModal] = useState({ show: false, title: '', placeholder: '', inputValue: '', onConfirm: null, isPassword: false, allowEmpty: false });
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000); 
  };

  const fetchData = useCallback(async () => {
    try {
      const [eqResponse, tkResponse, usResponse, resetResponse, historyResponse] = await Promise.all([
        api.get('/equipments'),
        api.get('/tickets'),
        api.get('/users'),
        api.get('/password-resets').catch(() => ({ data: [] })),
        api.get('/password-resets/history').catch(() => ({ data: [] }))
      ]);
      setEquipments(eqResponse.data);
      setTickets(tkResponse.data);
      setUsersList(usResponse.data);
      setResetRequests(resetResponse.data);
      setResetHistory(historyResponse.data);
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
        logoutContext();
        navigate('/');
      }
    };
    return () => sse.close();
  }, [fetchData, user, logoutContext, navigate]);

  const handleCadastrarUsuario = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/admin-create', novoUser);
      setShowUserModal(false);
      showToast(`Funcionário cadastrado! A matrícula é ${novoUser.matricula}. A senha automática foi gerada.`, 'success');
      setNovoUser({ nome: '', email: '', matricula: '', role: 'USER' });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Erro ao cadastrar usuário.', 'error');
    }
  };

  const handleAprovarReset = async (id) => {
    try {
      await api.post(`/password-resets/${id}/approve`);
      showToast('Solicitação aprovada! Nova senha gerada.', 'success');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Erro ao aprovar reset.', 'error');
    }
  };

  const handleRecusarReset = async (id) => {
    try {
      await api.post(`/password-resets/${id}/reject`);
      showToast('Solicitação recusada com sucesso.', 'success');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Erro ao recusar reset.', 'error');
    }
  };

  const handleDeletarEquipamentoManual = (id, patrimonio) => {
    setConfirmModal({
      show: true, title: 'Remover Patrimônio', message: `Tem certeza que deseja remover o equipamento de patrimônio número ${patrimonio}?`,
      onConfirm: async () => {
        try {
          await api.delete(`/equipments/${id}`);
          showToast('Equipamento removido com sucesso!', 'success');
          fetchData();
        } catch (err) { showToast(err.response?.data?.error || 'Erro ao remover.', 'error'); }
      }
    });
  };

  const handleAlterarStatusChamado = (ticketId, statusAtual, novoStatus) => {
    if (statusAtual === novoStatus) return;
    
    // 🌟 A MÁGICA AQUI: Sempre que o admin mexer no status, apagamos a memória do "X" do alerta
    // Assim, se o chamado explodir e voltar depois, o aviso piscará de novo!
    localStorage.removeItem(`alerta_visto_${ticketId}`);
    
    if (['Concluído', 'Aguardando Confirmação'].includes(novoStatus)) {
      setPromptModal({
        show: true,
        title: 'Concluir Chamado',
        placeholder: 'Informe uma observação da solução aplicada...',
        inputValue: '',
        isPassword: false,
        allowEmpty: true,
        onConfirm: async (res) => {
          try {
            await api.patch(`/tickets/${ticketId}/status`, { status_chamado: 'Aguardando Confirmação', resolucao_ti: res || '' });
            showToast('Chamado enviado para confirmação do usuário!', 'success');
            fetchData();
          } catch (error) { showToast(error.response?.data?.error || 'Erro ao atualizar status.', 'error'); }
        }
      });
    } else if (novoStatus === 'Baixa') {
      setPromptModal({
        show: true, title: 'Justificativa de Baixa', placeholder: 'Informe o motivo técnico...', inputValue: '', isPassword: false,
        allowEmpty: false,
        onConfirm: async (motivo) => {
          try {
            const ticketAlvo = tickets.find(t => t.id === ticketId);
            await api.patch(`/tickets/${ticketId}/status`, { status_chamado: novoStatus, resolucao_ti: motivo });
            if (ticketAlvo && ticketAlvo.equipment_id) await api.delete(`/equipments/${ticketAlvo.equipment_id}`); 
            showToast('Equipamento baixado com sucesso.', 'success');
            fetchData();
          } catch (error) { showToast(error.response?.data?.error, 'error'); }
        }
      });
    } else {
       api.patch(`/tickets/${ticketId}/status`, { status_chamado: novoStatus }).then(() => { 
         showToast('Status atualizado!', 'success');
         fetchData(); 
       });
    }
  };

  const handleCadastrarEquipamento = async (e) => {
    e.preventDefault();
    try {
      await api.post('/equipments', novoEq);
      setShowModal(false);
      showToast('Patrimônio cadastrado!', 'success');
      setNovoEq({ patrimonio: '', tipo: '', observacao: '' });
      fetchData();
    } catch (err) { showToast(err.response?.data?.error, 'error'); }
  };

  const handleAtribuirTecnico = async (ticketId, tecnicoId) => {
    try {
      const payloadId = tecnicoId === "" ? null : tecnicoId;
      await api.patch(`/tickets/${ticketId}/assign`, { tecnico_id: payloadId });
      showToast('Responsável pelo chamado atualizado!', 'success');
      fetchData(); 
    } catch (err) {
      showToast(err.response?.data?.error || 'Erro ao atribuir técnico.', 'error');
    }
  };

  const handleDevolverChamadoSubmit = async (ticketId, payload) => {
    try {
      await api.patch(`/tickets/${ticketId}/devolver`, payload);
      
      // 🌟 A MÁGICA AQUI: Remove o "visto" do localStorage para reativar o alerta piscante
      localStorage.removeItem(`alerta_visto_${ticketId}`);

      setShowDevolverModal(false);
      setTicketParaDevolver(null);
      showToast('Chamado devolvido para correção do usuário!', 'success');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Erro ao devolver chamado.', 'error');
    }
  };

  // 🌟 NOVA FUNÇÃO: Abre o modal de devolução (será passado para a tabela)
  const openDevolverModal = (ticket) => {
    setTicketParaDevolver(ticket);
    setShowDevolverModal(true);
  };

  return {
    equipments, tickets, usersList, resetRequests, resetHistory, loading, activeTab, setActiveTab, statusFilter, setStatusFilter,
    showModal, setShowModal, showProfileModal, setShowProfileModal, showUserModal, setShowUserModal, 
    novoEq, setNovoEq, novoUser, setNovoUser,
    confirmModal, setConfirmModal, promptModal, setPromptModal, toast, setToast, showToast, 
    showDevolverModal, setShowDevolverModal, ticketParaDevolver, // 🌟 Exportando estados do novo modal
    handleDeletarEquipamentoManual, handleAlterarStatusChamado, handleCadastrarEquipamento, 
    handleCadastrarUsuario, handleAprovarReset, handleRecusarReset, handleAtribuirTecnico, 
    handleDevolverChamadoSubmit, openDevolverModal, // 🌟 Exportando as funções
    fetchData
  };
}