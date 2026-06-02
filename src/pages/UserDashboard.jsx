import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useUserDashboard } from '../hooks/useUserDashboard';

import Header from '../components/layout/Header';
import TicketForm from '../components/user/TicketForm';
import MyTicketsTable from '../components/user/MyTicketsTable';
import UserProfileModal from '../components/modals/UserProfileModal';

export default function UserDashboard() {
  const { user, logoutContext } = useContext(AuthContext); 
  const navigate = useNavigate();
  const hook = useUserDashboard(user, logoutContext, navigate); // <--- ATUALIZADO AQUI

  return (
    <div className="min-h-screen bg-slate-100">
      <Header title="Portal do Servidor - Suporte TI" user={user} onLogout={() => { logoutContext(); navigate('/'); }} onEditProfileClick={() => hook.setShowProfileModal(true)} />

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TicketForm 
            editingTicketId={hook.editingTicketId} onCancel={hook.handleCancelarEdicao} onSubmit={hook.handleSubmitForm} mensagem={hook.mensagem}
            patrimonio={hook.patrimonio} setPatrimonio={hook.setPatrimonio} tipo={hook.tipo} setTipo={hook.setTipo} localizacao={hook.localizacao} setLocalizacao={hook.setLocalizacao} descricao={hook.descricao} setDescricao={hook.setDescricao}
          />
        </div>
        <div className="md:col-span-2">
          <MyTicketsTable tickets={hook.meusChamados} equipments={hook.equipments} onEditClick={hook.handleIniciarEdicao} />
        </div>
      </main>

      <UserProfileModal show={hook.showProfileModal} onClose={() => hook.setShowProfileModal(false)} user={user} onSuccess={(msg) => { alert(msg); logoutContext(); navigate('/'); }} />
    </div>
  );
}