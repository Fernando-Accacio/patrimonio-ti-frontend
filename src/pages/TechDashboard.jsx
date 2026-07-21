import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTechDashboard } from '../hooks/useTechDashboard';

import Header from '../components/layout/Header';
import TechMyTicketsTable from '../components/tech/TechMyTicketsTable';
import TechQueueTable from '../components/tech/TechQueueTable';
import TechHistoryTable from '../components/tech/TechHistoryTable'; 
import UserProfileModal from '../components/modals/UserProfileModal';
import GlobalModals from '../components/modals/GlobalModals';
import FirstAccessLock from '../components/modals/FirstAccessLock'; // 🌟 IMPORTADO AQUI
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function TechDashboard() {
  const { user, logoutContext, loginContext } = useContext(AuthContext); // 🌟 PUXEI O loginContext
  const navigate = useNavigate();
  const hook = useTechDashboard(user, logoutContext, navigate);

  // 🌟 TRAVA DE SEGURANÇA APLICADA AO TÉCNICO
  if (user?.primeira_senha) {
    return (
      <FirstAccessLock 
        user={user} 
        logoutContext={logoutContext} 
        loginContext={loginContext} 
        onSuccess={(msg) => hook.showToast(msg, 'success')} 
      />
    );
  }

  if (hook.loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Carregando Painel Técnico...</div>;

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-hidden">
      <Header title="Portal do Técnico - Central de Suporte" user={user} onLogout={() => { logoutContext(); navigate('/'); }} onEditProfileClick={() => hook.setShowProfileModal(true)} />
      
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <TechMyTicketsTable 
          meusChamados={hook.meusChamados} equipments={hook.equipments} usersList={hook.usersList} 
        />
        
        <TechQueueTable 
          chamadosLivres={hook.chamadosLivres} equipments={hook.equipments} usersList={hook.usersList} 
        />

        <TechHistoryTable 
          historicoRecente={hook.historicoRecente} equipments={hook.equipments} usersList={hook.usersList} 
        />
      </main>

      {/* Modais Globais */}
      <UserProfileModal show={hook.showProfileModal} onClose={() => hook.setShowProfileModal(false)} user={user} onSuccess={(msg) => hook.showToast(msg, 'success')} />
      <GlobalModals 
        alertModal={{ show: false, title: '', message: '' }} setAlertModal={() => {}} 
        confirmModal={hook.confirmModal} setConfirmModal={hook.setConfirmModal} 
        promptModal={hook.promptModal} setPromptModal={hook.setPromptModal} 
      />

      {/* Toast Notificação */}
      {hook.toast.show && (
        <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-4 rounded-lg shadow-2xl text-white font-medium text-sm animate-in slide-in-from-bottom-8 fade-in duration-300 ${
          hook.toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {hook.toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{hook.toast.message}</span>
          <button onClick={() => hook.setToast({ ...hook.toast, show: false })} className="ml-2 text-white/70 hover:text-white transition cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}