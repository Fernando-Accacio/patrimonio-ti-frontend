import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { getSseUrl } from '../services/sse';

import Header from '../components/layout/Header';
import DashboardStats from '../components/admin/DashboardStats';
import EquipmentTable from '../components/admin/EquipmentTable';
import TicketTable from '../components/admin/TicketTable';
import UserManagementTable from '../components/admin/UserManagementTable';

// Modais Componentizados
import EquipmentFormModal from '../components/modals/EquipmentFormModal';
import UserProfileModal from '../components/modals/UserProfileModal';
import AlertModal from '../components/modals/AlertModal';
import ConfirmModal from '../components/modals/ConfirmModal';
import PromptModal from '../components/modals/PromptModal';

export default function AdminDashboard() {
  const { user, logoutContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const [equipments, setEquipments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [novoEq, setNovoEq] = useState({ patrimonio: '', tipo: '', observacao: '' });

  // Estados dos Modais
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
    };
    return () => sse.close();
  }, [fetchData]);

  const showAlert = (title, message, type = 'info') => setAlertModal({ show: true, title, message, type });

  const handleDeletarEquipamentoManual = (id, patrimonio) => {
    setConfirmModal({
      show: true,
      title: 'Remover Patrimônio',
      message: `Tem certeza que deseja remover o equipamento de patrimônio número ${patrimonio}? O histórico de chamados atrelados a ele continuará salvo.`,
      onConfirm: async () => {
        try {
          await api.delete(`/equipments/${id}`);
          showAlert('Sucesso', 'Equipamento removido com sucesso via soft-delete!', 'success');
          fetchData();
        } catch (err) {
          showAlert('Erro', err.response?.data?.error || 'Erro ao remover equipamento.', 'error');
        }
      }
    });
  };

  const handleAlterarStatusChamado = (ticketId, statusAtual, novoStatus) => {
    if (statusAtual === novoStatus) return;

    if (novoStatus === 'Concluído') {
      setPromptModal({
        show: true, 
        title: 'Finalizar Chamado', 
        placeholder: 'Descreva detalhadamente a solução aplicada...', 
        inputValue: '',
        isPassword: false,
        onConfirm: async (res) => {
          try {
            await api.patch(`/tickets/${ticketId}/status`, { status_chamado: novoStatus, resolucao_ti: res });
            showAlert('Sucesso', 'Chamado resolvido com sucesso!', 'success');
            fetchData();
          } catch (error) {
            showAlert('Erro', error.response?.data?.error || "Erro ao concluir chamado.", 'error');
            fetchData();
          }
        }
      });

    } else if (novoStatus === 'Baixa') {
      setPromptModal({
        show: true,
        title: 'Justificativa de Baixa do Equipamento',
        placeholder: 'Informe o motivo técnico do descarte/baixa permanente deste patrimônio...',
        inputValue: '',
        isPassword: false,
        onConfirm: async (motivo) => {
          try {
            const ticketAlvo = tickets.find(t => t.id === ticketId);
            await api.patch(`/tickets/${ticketId}/status`, { status_chamado: novoStatus, resolucao_ti: motivo });
            
            if (ticketAlvo && ticketAlvo.equipment_id) {
              await api.delete(`/equipments/${ticketAlvo.equipment_id}`); 
            }
            
            showAlert('Sucesso', 'Equipamento inativado e baixado do sistema com sucesso.', 'success');
            fetchData();
          } catch (error) {
            showAlert('Erro', error.response?.data?.error || "Erro ao aplicar baixa.", 'error');
            fetchData();
          }
        }
      });
    } else {
       api.patch(`/tickets/${ticketId}/status`, { status_chamado: novoStatus })
       .then(() => {
           showAlert('Aviso', 'Chamado reaberto com sucesso.', 'info');
           fetchData();
       })
       .catch(err => {
           showAlert('Erro', err.response?.data?.error || "Erro ao atualizar o chamado.", 'error');
           fetchData();
       });
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Carregando painel Admin...</div>;

  return (
    <div className="min-h-screen bg-slate-100 relative">
      <Header title="Patrimônio TI - Painel Suporte" user={user} onLogout={() => { logoutContext(); navigate('/'); }} onEditProfileClick={() => setShowProfileModal(true)} />
      
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-6">
          <button onClick={() => setActiveTab('dashboard')} className={`py-4 px-2 font-semibold border-b-2 text-sm text-slate-600 cursor-pointer ${activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}>Painel Operacional</button>
          <button onClick={() => setActiveTab('usuarios')} className={`py-4 px-2 font-semibold border-b-2 text-sm text-slate-600 cursor-pointer ${activeTab === 'usuarios' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}>Servidores ({usersList.length})</button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <>
            <DashboardStats equipments={equipments} tickets={tickets} currentFilter={statusFilter} setFilter={setStatusFilter} />
            
            <EquipmentTable 
              equipments={equipments} 
              onNewClick={() => setShowModal(true)} 
              onDeleteClick={handleDeletarEquipamentoManual} 
            />
            
            {/* CORREÇÃO AQUI: Devolvendo a tabela de Gestão de Chamados para a tela! */}
            <TicketTable 
              tickets={tickets} 
              equipments={equipments} 
              usersList={usersList} 
              filter={statusFilter} 
              onUpdateStatus={handleAlterarStatusChamado} 
            />
          </>
        )}
        
        {activeTab === 'usuarios' && (
          <UserManagementTable 
            users={usersList} 
            currentUser={user} 
            onUpdateRole={(id, nome, role) => {
              setConfirmModal({
                show: true,
                title: 'Alterar Nível de Acesso',
                message: `Tem certeza que deseja alterar o cargo de "${nome}" para ${role}?`,
                onConfirm: async () => {
                  try {
                    await api.patch(`/users/${id}/role`, { role });
                    showAlert('Sucesso', 'Cargo updated!', 'success');
                    fetchData();
                  } catch (err) { showAlert('Erro', err.response?.data?.error, 'error'); }
                }
              });
            }} 
            onDelete={(id, nome) => {
              setConfirmModal({
                show: true,
                title: 'Remover Acesso',
                message: `Tem certeza que deseja remover o servidor "${nome}"?`,
                onConfirm: async () => {
                  try {
                    await api.delete(`/users/${id}`);
                    showAlert('Sucesso', 'Usuário removido.', 'success');
                    fetchData();
                  } catch (err) { showAlert('Erro', err.response?.data?.error, 'error'); }
                }
              });
            }}
            onResetPasswordClick={(selectedUser) => {
              setPromptModal({
                show: true,
                title: `Nova Senha para ${selectedUser.nome}`,
                placeholder: 'Digite a nova senha (mínimo 6 caracteres)...',
                inputValue: '',
                isPassword: true,
                onConfirm: async (senhaNova) => {
                  if (senhaNova && senhaNova.trim().length >= 6) {
                    try {
                      await api.patch(`/users/${selectedUser.id}/password`, { novaSenha: senhaNova });
                      showAlert('Sucesso', 'Senha do funcionário alterada!', 'success');
                    } catch (err) { showAlert('Erro', err.response?.data?.error, 'error'); }
                  } else {
                    showAlert('Erro', 'A senha precisa ter pelo menos 6 caracteres.', 'error');
                  }
                }
              });
            }}
          />
        )}
      </main>

      {/* Renderização dos Modais */}
      <EquipmentFormModal show={showModal} onClose={() => setShowModal(false)} onSubmit={handleCadastrarEquipamento} novoEq={novoEq} setNovoEq={setNovoEq} />
      <UserProfileModal show={showProfileModal} onClose={() => setShowProfileModal(false)} user={user} onSuccess={(msg) => showAlert('Sucesso', msg, 'success')} />

      <AlertModal 
        show={alertModal.show} 
        title={alertModal.title} 
        message={alertModal.message} 
        type={alertModal.type} 
        onClose={() => setAlertModal({ ...alertModal, show: false })} 
      />

      <ConfirmModal 
        show={confirmModal.show} 
        title={confirmModal.title} 
        message={confirmModal.message} 
        onCancel={() => setConfirmModal({ ...confirmModal, show: false })} 
        onConfirm={() => { confirmModal.onConfirm(); setConfirmModal({ ...confirmModal, show: false }); }} 
      />

      <PromptModal 
        show={promptModal.show} 
        title={promptModal.title} 
        placeholder={promptModal.placeholder} 
        inputValue={promptModal.inputValue} 
        setInputValue={(val) => setPromptModal({ ...promptModal, inputValue: val })} 
        isPassword={promptModal.isPassword} 
        onCancel={() => setPromptModal({ ...promptModal, show: false })} 
        onConfirm={() => { promptModal.onConfirm(promptModal.inputValue); setPromptModal({ ...promptModal, show: false }); }} 
      />
    </div>
  );
}