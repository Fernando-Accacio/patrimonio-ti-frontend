import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { getSseUrl } from '../services/sse';

export function useUserDashboard(user, logoutContext, navigate) {
  const [meusChamados, setMeusChamados] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const [patrimonio, setPatrimonio] = useState('');
  const [tipo, setTipo] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [editingTicketId, setEditingTicketId] = useState(null);

  const carregarDados = useCallback(async () => {
    try {
      const [tkResponse, eqResponse] = await Promise.all([
        api.get('/tickets/me'),
        api.get('/equipments')
      ]);
      setMeusChamados(tkResponse.data);
      setEquipments(eqResponse.data);
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
      
      // ESCUTA O GRITO DO BACKEND PARA DESLOGAR
      if (payload?.action === 'FORCE_LOGOUT' && payload.userId === user?.id) {
        alert('Sua sessão foi modificada ou encerrada pelo administrador.');
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
    if (matchedEq) {
      setPatrimonio(matchedEq.patrimonio);
      setTipo(matchedEq.tipo);
      setLocalizacao(matchedEq.observacao || '');
    }
    setMensagem({ tipo: '', texto: '' });
  };

  const handleCancelarEdicao = () => {
    setEditingTicketId(null);
    setDescricao(''); setPatrimonio(''); setTipo(''); setLocalizacao('');
    setMensagem({ tipo: '', texto: '' });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });
    try {
      if (editingTicketId) {
        await api.put(`/tickets/${editingTicketId}`, { patrimonio, tipo, localizacao, descricao_problema: descricao });
        setMensagem({ tipo: 'sucesso', texto: 'Chamado e patrimônio atualizados com sucesso!' });
      } else {
        await api.post('/tickets', { patrimonio, tipo, localizacao, descricao_problema: descricao });
        setMensagem({ tipo: 'sucesso', texto: 'Chamado aberto com sucesso!' });
      }
      handleCancelarEdicao();
      carregarDados(); 
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: error.response?.data?.error || 'Erro ao processar a requisição.' });
    }
  };

  return {
    meusChamados, equipments, showProfileModal, setShowProfileModal,
    patrimonio, setPatrimonio, tipo, setTipo, localizacao, setLocalizacao,
    descricao, setDescricao, mensagem, editingTicketId,
    handleIniciarEdicao, handleCancelarEdicao, handleSubmitForm
  };
}