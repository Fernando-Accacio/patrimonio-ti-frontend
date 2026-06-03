import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { getSseUrl } from '../services/sse';

import Header from '../components/layout/Header';
import UserProfileModal from '../components/modals/UserProfileModal';
import GlobalModals from '../components/modals/GlobalModals'; // <-- IMPORTADO O MODAL GLOBAL AQUI
import { Wrench, Inbox, CheckCircle2, AlertCircle, X, Check, Trash2 } from 'lucide-react';

export default function TechDashboard() {
  const { user, logoutContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Estados para os Modais Globais (Prompt e Confirm)
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null });
  const [promptModal, setPromptModal] = useState({ show: false, title: '', placeholder: '', inputValue: '', onConfirm: null, isPassword: false });

  // Estado do Toast (Notificação flutuante)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000); 
  };

  const fetchData = useCallback(async () => {
    try {
      const [eqRes, tkRes, usRes] = await Promise.all([
        api.get('/equipments'),
        api.get('/tickets'), 
        api.get('/users')
      ]);
      setEquipments(eqRes.data);
      setTickets(tkRes.data);
      setUsersList(usRes.data);
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
      if (payload?.action === 'FORCE_LOGOUT' && payload.userId === user?.id) {
        logoutContext();
        navigate('/');
      }
    };
    return () => sse.close();
  }, [fetchData, user, logoutContext, navigate]);

  const handleAssumirChamado = async (ticketId) => {
    try {
      await api.patch(`/tickets/${ticketId}/assign`, { tecnico_id: user.id });
      showToast('Chamado atribuído a você com sucesso!', 'success');
    } catch (err) {
      showToast("Erro ao assumir chamado: " + (err.response?.data?.error || err.message), 'error');
    }
  };

  // ATUALIZADO: Agora usa o PromptModal bonitão em vez do prompt() nativo
  const handleAtualizarStatus = async (ticketId, novoStatus) => {
    if (novoStatus === 'Concluído') {
      setPromptModal({
        show: true, 
        title: 'Finalizar Chamado', 
        placeholder: 'Descreva a solução aplicada para finalizar o chamado...', 
        inputValue: '', 
        isPassword: false,
        onConfirm: async (resolucao) => {
          try {
            await api.patch(`/tickets/${ticketId}/status`, { status_chamado: novoStatus, resolucao_ti: resolucao });
            showToast('Chamado finalizado com sucesso!', 'success');
            fetchData();
          } catch (e) { 
            showToast("Erro: " + e.response?.data?.error, 'error'); 
          }
        }
      });
    } else if (novoStatus === 'Baixa') {
      setPromptModal({
        show: true, 
        title: 'Justificativa de Baixa', 
        placeholder: 'Informe o motivo técnico da baixa do equipamento...', 
        inputValue: '', 
        isPassword: false,
        onConfirm: async (motivo) => {
          try {
            await api.patch(`/tickets/${ticketId}/status`, { status_chamado: novoStatus, resolucao_ti: motivo });
            showToast('Equipamento baixado com sucesso!', 'success');
            fetchData();
          } catch (e) { 
            showToast("Erro: " + e.response?.data?.error, 'error'); 
          }
        }
      });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Carregando Painel Técnico...</div>;

  const chamadosLivres = tickets.filter(tk => tk.tecnico_id === null && tk.status_chamado === 'Aberto');
  const meusChamados = tickets.filter(tk => tk.tecnico_id === user?.id && tk.status_chamado === 'Aberto');

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-hidden">
      <Header title="Portal do Técnico - Central de Suporte" user={user} onLogout={() => { logoutContext(); navigate('/'); }} onEditProfileClick={() => setShowProfileModal(true)} />
      
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* SEÇÃO 1: OS CHAMADOS DELE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200">
          <div className="bg-blue-50/50 px-6 py-4 border-b flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg"><Wrench className="w-5 h-5 text-white" /></div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Meus Chamados em Andamento</h2>
              <p className="text-sm text-slate-500">Tarefas que estão sob sua responsabilidade neste momento.</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-medium border-b text-sm uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Abertura</th>
                  <th className="py-3 px-4">Solicitante</th>
                  <th className="py-3 px-4">Equipamento</th>
                  <th className="py-3 px-4 w-1/3">Problema</th>
                  <th className="py-3 px-4 text-center">Ações de Resolução</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {meusChamados.length === 0 ? (
                  <tr><td colSpan="5" className="py-8 text-center text-slate-400 italic text-sm">Você não possui chamados em andamento. Bom trabalho!</td></tr>
                ) : (
                  meusChamados.map((tk) => {
                    const eq = equipments.find(e => e.id === tk.equipment_id);
                    const solicitante = usersList.find(u => u.id === tk.user_id);
                    const dataDoChamado = tk.createdAt || tk.data_abertura; 

                    return (
                      <tr key={tk.id} className="hover:bg-slate-50 transition">
                        <td className="py-4 px-4 text-sm font-medium text-slate-500">
                          {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-slate-800">{solicitante?.nome || 'Removido'}</td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-bold text-blue-600 block">{eq?.patrimonio}</span>
                          <span className="text-xs text-slate-500 block mt-0.5">{eq?.observacao}</span>
                        </td>
                        <td className="py-4 px-4 text-sm leading-relaxed">{tk.descricao_problema}</td>
                        
                        <td className="py-4 px-4 text-center align-middle">
                          <div className="flex flex-col gap-2">
                            <button 
                              onClick={() => handleAtualizarStatus(tk.id, 'Concluído')}
                              className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-bold px-3 py-2 rounded-lg text-sm transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                            >
                              <Check className="w-4 h-4" /> Finalizar Chamado
                            </button>
                            <button 
                              onClick={() => handleAtualizarStatus(tk.id, 'Baixa')}
                              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-3 py-2 rounded-lg text-sm transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                            >
                              <Trash2 className="w-4 h-4" /> Dar Baixa (Descarte)
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SEÇÃO 2: A FILA GERAL */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200 delay-100">
          <div className="bg-amber-50/30 px-6 py-4 border-b flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-lg"><Inbox className="w-5 h-5 text-white" /></div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Fila de Espera Geral</h2>
              <p className="text-sm text-slate-500">Chamados novos que ainda não foram atribuídos a nenhum técnico.</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-medium border-b text-sm uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Abertura</th>
                  <th className="py-3 px-4">Solicitante</th>
                  <th className="py-3 px-4">Equipamento</th>
                  <th className="py-3 px-4 w-1/3">Problema</th>
                  <th className="py-3 px-4 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {chamadosLivres.length === 0 ? (
                  <tr><td colSpan="5" className="py-8 text-center text-slate-400 italic text-sm">Nenhum chamado pendente na fila geral.</td></tr>
                ) : (
                  chamadosLivres.map((tk) => {
                    const eq = equipments.find(e => e.id === tk.equipment_id);
                    const solicitante = usersList.find(u => u.id === tk.user_id);
                    const dataDoChamadoLivre = tk.createdAt || tk.data_abertura;

                    return (
                      <tr key={tk.id} className="hover:bg-slate-50 transition">
                        <td className="py-4 px-4 text-sm font-medium text-slate-500">
                          {dataDoChamadoLivre ? new Date(dataDoChamadoLivre).toLocaleString('pt-BR') : 'Sem data'}
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-slate-800">{solicitante?.nome || 'Removido'}</td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-bold text-blue-600 block">{eq?.patrimonio}</span>
                          <span className="text-xs text-slate-500 block mt-0.5">{eq?.observacao}</span>
                        </td>
                        <td className="py-4 px-4 text-sm leading-relaxed">{tk.descricao_problema}</td>
                        <td className="py-4 px-4 text-center">
                          <button 
                            onClick={() => handleAssumirChamado(tk.id)}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold px-4 py-2.5 rounded-lg text-sm transition cursor-pointer shadow-sm"
                          >
                            Assumir Chamado
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <UserProfileModal 
        show={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        user={user} 
        onSuccess={(msg) => showToast(msg, 'success')} 
      />

      {/* RENDERIZAÇÃO DOS MODAIS GLOBAIS (O "alertModal" vazio é só para evitar bugs se for lido por engano) */}
      <GlobalModals 
        alertModal={{ show: false, title: '', message: '' }} 
        setAlertModal={() => {}} 
        confirmModal={confirmModal} 
        setConfirmModal={setConfirmModal} 
        promptModal={promptModal} 
        setPromptModal={setPromptModal} 
      />

      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-2xl text-white font-medium text-sm animate-in slide-in-from-bottom-8 fade-in duration-300 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast({ ...toast, show: false })} className="ml-2 text-white/70 hover:text-white transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}