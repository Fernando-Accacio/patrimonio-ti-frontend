import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

import { useUserDashboard } from '../hooks/useUserDashboard';
import Header from '../components/layout/Header';
import TicketForm from '../components/user/TicketForm';
import MyTicketsTable from '../components/user/MyTicketsTable';
import UserProfileModal from '../components/modals/UserProfileModal';
import GlobalModals from '../components/modals/GlobalModals';
import { CheckCircle2, AlertCircle, X, ChevronDown } from 'lucide-react'; // 🌟 Importado ChevronDown

export default function UserDashboard() {
  const { user, logoutContext } = useContext(AuthContext); 
  const navigate = useNavigate();
  const hook = useUserDashboard(user, logoutContext, navigate);

  const handleResponderConfirmacao = async (ticketId, aprovado, motivo) => {
    try {
      await api.patch(`/tickets/${ticketId}/confirmar`, { 
        aprovado, 
        motivo 
      });

      hook.showToast(
        `Chamado ${aprovado ? 'finalizado com sucesso!' : 'retornado para a TI.'}`, 
        'success'
      );
      
      hook.carregarDados(); 
    } catch (error) {
      console.error("Erro na confirmação:", error);
      hook.showToast(
        error.response?.data?.error || 'Erro ao processar resposta de confirmação.', 
        'error'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-hidden">
      <Header title="Portal do Servidor - Suporte TI" user={user} onLogout={() => { logoutContext(); navigate('/'); }} onEditProfileClick={() => hook.setShowProfileModal(true)} />

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TicketForm 
            editingTicketId={hook.editingTicketId} onCancel={hook.handleCancelarEdicao} onSubmit={hook.handleSubmitForm}
            patrimonio={hook.patrimonio} setPatrimonio={hook.setPatrimonio} 
            tipo={hook.tipo} setTipo={hook.setTipo} 
            localizacao={hook.localizacao} setLocalizacao={hook.setLocalizacao} 
            descricao={hook.descricao} setDescricao={hook.setDescricao}
            tecnicosDisponiveis={hook.tecnicosDisponiveis} 
            tecnicoIdSelecionado={hook.tecnicoIdSelecionado} setTecnicoIdSelecionado={hook.setTecnicoIdSelecionado} 
          />
        </div>
        <div className="md:col-span-2 space-y-4"> {/* 🌟 Adicionado espaço entre elementos */}
          
          {/* 🌟 NOVO: Painel de Controle de Filtros por Status com visual moderno */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Minhas Solicitações
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Status:</span>
              <div className="relative flex items-center">
                <select
                  value={hook.filtroStatus}
                  onChange={(e) => hook.setFiltroStatus(e.target.value)}
                  className="pl-3 pr-8 py-1.5 text-xs font-bold border border-slate-300 rounded-lg outline-none bg-white transition cursor-pointer appearance-none text-slate-700 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="Todos">Todos os Status</option>
                  <option value="Aberto">Abertos</option>
                  <option value="Aguardando Confirmação">Aguardando Confirmação</option>
                  <option value="Concluído">Concluídos</option>
                  <option value="Cancelado">Cancelados</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
              </div>
            </div>
          </div>

          <MyTicketsTable 
            tickets={hook.chamadosFiltrados} // 🌟 PASSANDO A LISTA JÁ FILTRADA!
            equipments={hook.equipments} 
            onEditClick={hook.handleIniciarEdicao} 
            onCancelTicketClick={hook.handleCancelarChamado}
            onResponderConfirmacao={handleResponderConfirmacao}
            onFastReply={hook.handleSalvarEdicaoDireta}
          />
        </div>
      </main>

      <UserProfileModal show={hook.showProfileModal} onClose={() => hook.setShowProfileModal(false)} user={user} onSuccess={(msg) => hook.showToast(msg, 'success')} />

      <GlobalModals 
        alertModal={{ show: false, title: '', message: '' }} 
        setAlertModal={() => {}} 
        confirmModal={{ show: false, title: '', message: '', onConfirm: null }}
        setConfirmModal={() => {}} 
        promptModal={hook.promptModal} 
        setPromptModal={hook.setPromptModal} 
      />

      {hook.toast.show && (
        <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-4 rounded-lg shadow-2xl text-white font-medium text-sm animate-in slide-in-from-bottom-8 fade-in duration-300 ${
          hook.toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {hook.toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{hook.toast.message}</span>
          <button onClick={() => hook.setToast({ ...hook.toast, show: false })} className="ml-2 text-white/70 hover:text-white transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}