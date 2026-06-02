import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

import { useAdminDashboard } from '../hooks/useAdminDashboard';
import Header from '../components/layout/Header';
import DashboardStats from '../components/admin/DashboardStats';
import EquipmentTable from '../components/admin/EquipmentTable';
import TicketTable from '../components/admin/TicketTable';
import UserManagementTable from '../components/admin/UserManagementTable';
import EquipmentFormModal from '../components/modals/EquipmentFormModal';
import UserProfileModal from '../components/modals/UserProfileModal';
import GlobalModals from '../components/modals/GlobalModals';

export default function AdminDashboard() {
  const { user, logoutContext } = useContext(AuthContext);
  const navigate = useNavigate();
  const hook = useAdminDashboard(user, logoutContext, navigate); // <--- ATUALIZADO AQUI

  if (hook.loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Carregando painel Admin...</div>;

  return (
    <div className="min-h-screen bg-slate-100 relative">
      <Header title="Patrimônio TI - Painel Suporte" user={user} onLogout={() => { logoutContext(); navigate('/'); }} onEditProfileClick={() => hook.setShowProfileModal(true)} />
      
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-6">
          <button onClick={() => hook.setActiveTab('dashboard')} className={`py-4 px-2 font-semibold border-b-2 text-sm text-slate-600 cursor-pointer ${hook.activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}>Painel Operacional</button>
          <button onClick={() => hook.setActiveTab('usuarios')} className={`py-4 px-2 font-semibold border-b-2 text-sm text-slate-600 cursor-pointer ${hook.activeTab === 'usuarios' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}>Servidores ({hook.usersList.length})</button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {hook.activeTab === 'dashboard' && (
          <>
            <DashboardStats equipments={hook.equipments} tickets={hook.tickets} currentFilter={hook.statusFilter} setFilter={hook.setStatusFilter} />
            <EquipmentTable equipments={hook.equipments} onNewClick={() => hook.setShowModal(true)} onDeleteClick={hook.handleDeletarEquipamentoManual} />
            <TicketTable tickets={hook.tickets} equipments={hook.equipments} usersList={hook.usersList} filter={hook.statusFilter} onUpdateStatus={hook.handleAlterarStatusChamado} />
          </>
        )}
        
        {hook.activeTab === 'usuarios' && (
          <UserManagementTable 
            users={hook.usersList} currentUser={user} 
            onUpdateRole={(id, nome, role) => hook.setConfirmModal({ show: true, title: 'Alterar Cargo', message: `Alterar cargo de "${nome}" para ${role}?`, onConfirm: async () => { await api.patch(`/users/${id}/role`, { role }); hook.fetchData(); } })} 
            onDelete={(id, nome) => hook.setConfirmModal({ show: true, title: 'Remover Acesso', message: `Remover o servidor "${nome}"?`, onConfirm: async () => { await api.delete(`/users/${id}`); hook.fetchData(); } })}
            onResetPasswordClick={(selUser) => hook.setPromptModal({ show: true, title: `Nova Senha para ${selUser.nome}`, placeholder: 'Senha...', inputValue: '', isPassword: true, onConfirm: async (pass) => { await api.patch(`/users/${selUser.id}/password`, { novaSenha: pass }); hook.showAlert('Sucesso', 'Senha alterada!', 'success'); } })}
          />
        )}
      </main>

      <EquipmentFormModal show={hook.showModal} onClose={() => hook.setShowModal(false)} onSubmit={hook.handleCadastrarEquipamento} novoEq={hook.novoEq} setNovoEq={hook.setNovoEq} />
      <UserProfileModal show={hook.showProfileModal} onClose={() => hook.setShowProfileModal(false)} user={user} onSuccess={(msg) => hook.showAlert('Sucesso', msg, 'success')} />
      <GlobalModals alertModal={hook.alertModal} setAlertModal={hook.setAlertModal} confirmModal={hook.confirmModal} setConfirmModal={hook.setConfirmModal} promptModal={hook.promptModal} setPromptModal={hook.setPromptModal} />
    </div>
  );
}