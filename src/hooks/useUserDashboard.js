import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { getSseUrl } from '../services/sse';

export function useUserDashboard(user, logoutContext, navigate) {
  const [meusChamados, setMeusChamados] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [tecnicosDisponiveis, setTecnicosDisponiveis] = useState([]); 
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  const [patrimonio, setPatrimonio] = useState('');
  const [tipo, setTipo] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tecnicoIdSelecionado, setTecnicoIdSelecionado] = useState(''); 
  const [editingTicketId, setEditingTicketId] = useState(null);

  const [promptModal, setPromptModal] = useState({ show: false, title: '', placeholder: '', inputValue: '', onConfirm: null, isPassword: false });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000); 
  };

  const carregarDados = useCallback(async () => {
    try {
      const [tkResponse, eqResponse, usersResponse] = await Promise.all([
        api.get('/tickets/me'),
        api.get('/equipments'),
        api.get('/users').catch(() => ({ data: [] }))
      ]);
      setMeusChamados(tkResponse.data);
      setEquipments(eqResponse.data);
      const equipeTI = usersResponse.data.filter(u => u.role === 'TECH');
      setTecnicosDisponiveis(equipeTI);
    } catch (error) {
      console.error("Erro ao carregar dados do portal:", error);
    }
  }, []);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  useEffect(() => {
    const sse = new EventSource(getSseUrl());
    sse.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload?.action === 'RELOAD_DATA') carregarDados();
      if (payload?.action === 'FORCE_LOGOUT' && payload.userId === user?.id) {
        logoutContext();
        navigate('/');
      }
    };
    return () => sse.close();
  }, [carregarDados, user, logoutContext, navigate]);

  const handleIniciarEdicao = (ticket) => {
    const matchedEq = equipments.find(e => e.id === ticket.equipment_id);
    setEditingTicketId(ticket.id);
    setDescricao(ticket.descricao_problema);
    setTecnicoIdSelecionado(ticket.tecnico_id || '');
    if (matchedEq) {
      setPatrimonio(matchedEq.patrimonio);
      setTipo(matchedEq.equipment_type_id || '');
      setLocalizacao(matchedEq.sector_id || '');
    }
  };

  const handleCancelarEdicao = () => {
    setEditingTicketId(null);
    setDescricao(''); setPatrimonio(''); setTipo(''); setLocalizacao(''); setTecnicoIdSelecionado('');
  };

  const handleCancelarChamado = (ticketId) => {
    setPromptModal({
      show: true,
      title: 'Cancelar Solicitação',
      placeholder: 'Explique o motivo do cancelamento...',
      inputValue: '',
      isPassword: false,
      onConfirm: async (motivo) => {
        if (!motivo.trim()) {
          showToast('Você precisa informar um motivo válido.', 'error');
          return;
        }
        try {
          await api.patch(`/tickets/${ticketId}/cancel`, { motivo });
          showToast('Chamado cancelado com sucesso!', 'success');
          carregarDados();
        } catch (err) {
          showToast(err.response?.data?.error || 'Erro ao cancelar chamado.', 'error');
        }
      }
    });
  };

  const handleSalvarEdicaoDireta = async (ticketId, payload) => {
    try {
      await api.put(`/tickets/${ticketId}`, payload);
      showToast('Resposta enviada para o suporte!', 'success');
      carregarDados();
    } catch (error) {
      showToast(error.response?.data?.error || 'Erro ao responder.', 'error');
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const tecnicoPayload = tecnicoIdSelecionado ? Number(tecnicoIdSelecionado) : null;
    
    const payload = { 
      patrimonio, 
      descricao_problema: descricao, 
      tecnico_id: tecnicoPayload,
      equipment_type_id: Number(tipo),  
      sector_id: Number(localizacao)    
    };

    try {
      if (editingTicketId) {
        await api.put(`/tickets/${editingTicketId}`, payload);
        showToast('Chamado atualizado com sucesso!', 'success');
      } else {
        await api.post('/tickets', payload);
        showToast('Chamado aberto com sucesso!', 'success');
      }
      handleCancelarEdicao();
      carregarDados(); 
    } catch (error) {
      showToast(error.response?.data?.error || 'Erro ao processar.', 'error');
    }
  };

  // 🌟 NOVO: Função de confirmação transferida pra cá!
  const handleResponderConfirmacao = async (ticketId, aprovado, motivo) => {
    try {
      await api.patch(`/tickets/${ticketId}/confirmar`, { aprovado, motivo });
      showToast(`Chamado ${aprovado ? 'finalizado com sucesso!' : 'retornado para a TI.'}`, 'success');
      carregarDados(); 
    } catch (error) {
      console.error("Erro na confirmação:", error);
      showToast(error.response?.data?.error || 'Erro ao processar resposta.', 'error');
    }
  };

  const chamadosFiltrados = meusChamados.filter((ticket) => {
    if (filtroStatus === 'Todos') return true;
    return ticket.status_chamado === filtroStatus;
  });

  return {
    meusChamados, chamadosFiltrados, filtroStatus, setFiltroStatus,
    equipments, showProfileModal, setShowProfileModal,
    tecnicosDisponiveis, tecnicoIdSelecionado, setTecnicoIdSelecionado,
    patrimonio, setPatrimonio, tipo, setTipo, localizacao, setLocalizacao,
    descricao, setDescricao, editingTicketId, toast, setToast, showToast,
    promptModal, setPromptModal, handleCancelarChamado,
    handleIniciarEdicao, handleCancelarEdicao, handleSubmitForm, carregarDados,
    handleSalvarEdicaoDireta, handleResponderConfirmacao // 🌟 Exportando a função!
  };
}