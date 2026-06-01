import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { getSseUrl } from '../services/sse';

import Header from '../components/layout/Header';
import TicketForm from '../components/user/TicketForm';
import MyTicketsTable from '../components/user/MyTicketsTable';
import UserProfileModal from '../components/modals/UserProfileModal';

export default function UserDashboard() {
  const { user, logoutContext } = useContext(AuthContext); 
  const navigate = useNavigate();

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
    };
    return () => sse.close();
  }, [carregarDados]);

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
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });

    try {
      if (editingTicketId) {
        await api.put(`/tickets/${editingTicketId}`, { 
          patrimonio,
          tipo,
          localizacao,
          descricao_problema: descricao
        });
        setMensagem({ tipo: 'sucesso', texto: 'Chamado e patrimônio atualizados com sucesso!' });
      } else {
        // CORREÇÃO: Sintaxe consertada aqui mapeando a descrição corretamente
        await api.post('/tickets', { 
          patrimonio, 
          tipo, 
          localizacao, 
          descricao_problema: descricao 
        });
        setMensagem({ tipo: 'sucesso', texto: 'Chamado aberto com sucesso!' });
      }
      handleCancelarEdicao();
      carregarDados(); 
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: error.response?.data?.error || 'Erro ao processar a requisição.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header 
        title="Portal do Servidor - Suporte TI" 
        user={user} 
        onLogout={() => { logoutContext(); navigate('/'); }} 
        onEditProfileClick={() => setShowProfileModal(true)} 
      />

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TicketForm 
            editingTicketId={editingTicketId} onCancel={handleCancelarEdicao} onSubmit={handleSubmitForm} mensagem={mensagem}
            patrimonio={patrimonio} setPatrimonio={setPatrimonio} tipo={tipo} setTipo={setTipo} localizacao={localizacao} setLocalizacao={setLocalizacao} descricao={descricao} setDescricao={setDescricao}
          />
        </div>
        
        <div className="md:col-span-2">
          <MyTicketsTable tickets={meusChamados} equipments={equipments} onEditClick={handleIniciarEdicao} />
        </div>
      </main>

      {/* CORREÇÃO: Prop antiga removida, o modal agora se vira sozinho com abas de perfil/senha */}
      <UserProfileModal 
        show={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        user={user} 
        onSuccess={(msg) => {
          alert(msg);
          logoutContext(); 
          navigate('/');
        }} 
      />
    </div>
  );
}