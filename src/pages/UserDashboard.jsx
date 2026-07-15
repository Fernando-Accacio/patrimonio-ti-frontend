import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import { useUserDashboard } from '../hooks/useUserDashboard'; // Ajuste os caminhos (../) se necessário
import Header from '../components/layout/Header';
import TicketForm from '../components/user/TicketForm';
import MyTicketsTable from '../components/user/MyTicketsTable';
import UserProfileModal from '../components/modals/UserProfileModal';
import GlobalModals from '../components/modals/GlobalModals';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { responderConfirmacaoTicket } from '../services/api';

export default function UserDashboard() {
  const { user, logoutContext } = useContext(AuthContext); 
  const navigate = useNavigate();
  const hook = useUserDashboard(user, logoutContext, navigate);

  // 🌟 CORREÇÃO DEFINITIVA: Rota direta alinhada com o backend Fastify
  const handleResponderConfirmacao = async (ticketId, aprovado, motivo) => {
    try {
      // Envia os dados exatamente como a sua Service/Controller esperam receber no Body
      await api.post(`/tickets/${ticketId}/responder-confirmacao`, { 
        aprovado, 
        motivo 
      });

      hook.showToast(
        `Chamado ${aprovado ? 'finalizado com sucesso!' : 'retornado para a fila da TI.'}`, 
        'success'
      );
      
      hook.carregarDados(); // Atualiza o painel na hora
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
        <div className="md:col-span-2">
          <MyTicketsTable 
            tickets={hook.meusChamados} 
            equipments={hook.equipments} 
            // 🌟 CORREÇÃO AQUI: Agora aponta para a função direta que envia a resposta para a API!
            onEditClick={hook.handleSalvarEdicaoDireta} 
            onCancelTicketClick={hook.handleCancelarChamado}
            onResponderConfirmacao={handleResponderConfirmacao}
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