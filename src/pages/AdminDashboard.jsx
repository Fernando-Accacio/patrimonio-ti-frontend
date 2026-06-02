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
  const hook = useAdminDashboard(user, logoutContext, navigate);

  if (hook.loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Carregando painel Admin...</div>;

  return (
    <div className="min-h-screen bg-slate-100 relative">
      <Header title="Patrimônio TI - Painel Suporte" user={user} onLogout={() => { logoutContext(); navigate('/'); }} onEditProfileClick={() => hook.setShowProfileModal(true)} />
      
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-6">
          <button onClick={() => hook.setActiveTab('dashboard')} className={`py-4 px-2 font-semibold border-b-2 text-sm text-slate-600 cursor-pointer ${hook.activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}>Painel Operacional</button>
          <button onClick={() => hook.setActiveTab('usuarios')} className={`py-4 px-2 font-semibold border-b-2 text-sm text-slate-600 cursor-pointer ${hook.activeTab === 'usuarios' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}>Servidores ({hook.usersList.length})</button>
          <button onClick={() => hook.setActiveTab('resets')} className={`py-4 px-2 font-semibold border-b-2 text-sm text-slate-600 cursor-pointer ${hook.activeTab === 'resets' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}>Solicitações de Senha ({hook.resetRequests.length})</button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
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
          />
        )}

        {hook.activeTab === 'resets' && (
          <>
            {/* TABELA 1: PEDIDOS PENDENTES */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200">
              <div className="bg-slate-50 px-6 py-4 border-b">
                <h2 className="text-base font-bold text-slate-800">Solicitações Pendentes de Análise</h2>
                <p className="text-xs text-slate-500">Pedidos aguardando liberação de acesso por parte da gerência de TI.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-medium border-b text-xs uppercase">
                    <tr>
                      <th className="py-3 px-6">Servidor</th>
                      <th className="py-3 px-6">E-mail (Ofuscado)</th>
                      <th className="py-3 px-6">Data do Pedido</th>
                      <th className="py-3 px-6 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {hook.resetRequests.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-6 text-center text-slate-400 italic text-xs">Nenhuma solicitação pendente no momento.</td>
                      </tr>
                    ) : (
                      hook.resetRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50 transition">
                          <td className="py-4 px-6 font-semibold text-slate-800">{req.nome}</td>
                          <td className="py-4 px-6 font-mono text-slate-600 text-xs">{req.email}</td>
                          <td className="py-4 px-6 text-slate-500 text-xs">{new Date(req.dataSolicitacao).toLocaleString('pt-BR')}</td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => hook.handleAprovarReset(req.id)} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer shadow-sm">Aprovar</button>
                              <button onClick={() => hook.handleRecusarReset(req.id)} className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer">Recusar</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABELA 2: HISTÓRICO RECENTE (ÚLTIMOS 5) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200">
              <div className="bg-slate-50 px-6 py-4 border-b">
                <h2 className="text-base font-bold text-slate-800">Histórico de Ações Recentes (Últimos 5)</h2>
                <p className="text-xs text-slate-500">Registro de auditoria local das últimas redefinições gerenciadas nesta sessão.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-medium border-b text-xs uppercase">
                    <tr>
                      <th className="py-3 px-6">Servidor</th>
                      <th className="py-3 px-6">E-mail (Ofuscado)</th>
                      <th className="py-3 px-6">Processado em</th>
                      <th className="py-3 px-6 text-center">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {hook.resetHistory.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-6 text-center text-slate-400 italic text-xs">Nenhum histórico registrado nesta sessão.</td>
                      </tr>
                    ) : (
                      hook.resetHistory.map((hist) => (
                        <tr key={hist.id} className="bg-slate-50/40 text-slate-500">
                          <td className="py-3 px-6 font-medium text-slate-700">{hist.nome}</td>
                          <td className="py-3 px-6 font-mono text-xs">{hist.email}</td>
                          <td className="py-3 px-6 text-xs">{new Date(hist.dataProcessamento).toLocaleString('pt-BR')}</td>
                          <td className="py-3 px-6 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              hist.status === 'Aprovado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {hist.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      <EquipmentFormModal show={hook.showModal} onClose={() => hook.setShowModal(false)} onSubmit={hook.handleCadastrarEquipamento} novoEq={hook.novoEq} setNovoEq={hook.setNovoEq} />
      <UserProfileModal show={hook.showProfileModal} onClose={() => hook.setShowProfileModal(false)} user={user} onSuccess={(msg) => hook.showAlert('Sucesso', msg, 'success')} />
      <GlobalModals alertModal={hook.alertModal} setAlertModal={hook.setAlertModal} confirmModal={hook.confirmModal} setConfirmModal={hook.setConfirmModal} promptModal={hook.promptModal} setPromptModal={hook.setPromptModal} />
    </div>
  );
}