import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { LogOut, Monitor, Ticket, Wrench, CheckCircle, Plus, X, Users, LayoutDashboard, Trash2, AlertTriangle, Info } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logoutContext } = useContext(AuthContext);
  const navigate = useNavigate();

  // ESTADOS BASE
  const [equipments, setEquipments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ESTADOS DE CONTROLE DE TELA E FILTROS
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [showAllEquipments, setShowAllEquipments] = useState(false);
  const [novoEq, setNovoEq] = useState({ patrimonio: '', tipo: '', observacao: '' });
  const [expandedTickets, setExpandedTickets] = useState({});

  // ==========================================
  // ESTADOS DOS NOVOS MODAIS CUSTOMIZADOS
  // ==========================================
  
  // Modal de Aviso Simples (Sucesso/Erro)
  const [alertModal, setAlertModal] = useState({ show: false, title: '', message: '', type: 'info' }); // type: 'success', 'error', 'info'
  
  // Modal de Confirmação (Sim/Não)
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null });
  
  // Modal de Prompt (Input de Texto)
  const [promptModal, setPromptModal] = useState({ show: false, title: '', placeholder: '', inputValue: '', onConfirm: null, ticketData: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
  };

  const handleLogout = () => {
    logoutContext();
    navigate('/');
  };

  const toggleExpandirChamado = (id) => {
    setExpandedTickets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper para mostrar alertas customizados
  const showAlert = (title, message, type = 'info') => {
    setAlertModal({ show: true, title, message, type });
  };

  // ==========================================
  // FUNÇÕES REFATORADAS SEM WINDOW.ALERT/PROMPT
  // ==========================================

  const handleAlterarStatusChamado = (ticketId, statusAtual, novoStatus) => {
    if (statusAtual === novoStatus) return;

    if (novoStatus === 'Concluído') {
      // Abre o Modal de Prompt pedindo a solução
      setPromptModal({
        show: true,
        title: 'Finalizar Chamado',
        placeholder: 'Descreva detalhadamente a solução aplicada...',
        inputValue: '',
        ticketData: { ticketId, novoStatus },
        onConfirm: async (resolucao) => {
          if (!resolucao.trim()) return; // Validação simples
          try {
            await api.patch(`/tickets/${ticketId}/status`, { status_chamado: novoStatus, resolucao_ti: resolucao });
            showAlert('Sucesso', `Chamado resolvido com sucesso!`, 'success');
            fetchData();
          } catch (error) {
            showAlert('Erro', error.response?.data?.error || "Erro ao atualizar o chamado.", 'error');
            fetchData(); // Reseta o select
          }
        }
      });

    } else if (novoStatus === 'Baixa') {
      // Abre o Modal de Confirmação
      setConfirmModal({
        show: true,
        title: 'Atenção: Baixa de Equipamento',
        message: 'Tem certeza que deseja marcar este chamado e o equipamento vinculado como "Baixa"? Esta ação indicará que o equipamento foi desativado.',
        onConfirm: async () => {
          try {
            await api.patch(`/tickets/${ticketId}/status`, { status_chamado: novoStatus, resolucao_ti: null });
            showAlert('Sucesso', 'Status atualizado para Baixa.', 'success');
            fetchData();
          } catch (error) {
            showAlert('Erro', error.response?.data?.error || "Erro ao atualizar o chamado.", 'error');
            fetchData();
          }
        }
      });
    } else {
       // Se voltar para aberto, só vai direto (se o backend permitir)
       api.patch(`/tickets/${ticketId}/status`, { status_chamado: novoStatus, resolucao_ti: null })
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
      showAlert('Sucesso', 'Equipamento cadastrado com sucesso!', 'success');
      setNovoEq({ patrimonio: '', tipo: '', observacao: '' });
      fetchData(); 
    } catch (error) {
      showAlert('Erro', error.response?.data?.error || "Erro ao cadastrar equipamento.", 'error');
    }
  };

  const handleAlterarRole = async (userId, targetRole) => {
    if (userId === user.id) {
      showAlert('Ação Bloqueada', 'Você não pode alterar o seu próprio nível de acesso!', 'error');
      fetchData(); // Reseta a seleção
      return;
    }

    try {
      await api.patch(`/users/${userId}/role`, { role: targetRole });
      showAlert('Sucesso', 'Nível de acesso do funcionário atualizado com sucesso!', 'success');
      fetchData();
    } catch (error) {
      showAlert('Erro', error.response?.data?.error || "Erro ao alterar nível de acesso.", 'error');
      fetchData();
    }
  };

  const handleDeletarUsuario = (userId, userNome) => {
    if (userId === user.id) {
      showAlert('Ação Bloqueada', 'Você não pode remover a si mesmo do sistema!', 'error');
      return;
    }

    setConfirmModal({
        show: true,
        title: 'Remover Acesso',
        message: `Tem certeza que deseja remover o acesso do servidor "${userNome}"? O histórico de chamados dele será preservado.`,
        onConfirm: async () => {
            try {
                await api.delete(`/users/${userId}`);
                showAlert('Sucesso', 'Usuário removido com sucesso.', 'success');
                fetchData();
              } catch (error) {
                showAlert('Erro', error.response?.data?.error || "Erro ao remover usuário.", 'error');
              }
        }
    })
  };

  // Contadores
  const chamadosAbertos = tickets.filter(t => t.status_chamado === 'Aberto').length;
  const chamadosResolvidos = tickets.filter(t => t.status_chamado === 'Concluído').length;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Carregando painel...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 relative">
      
      {/* ==================== MODAIS ==================== */}

      {/* 1. Modal de Alerta (Sucesso/Erro/Info) */}
      {alertModal.show && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className={`p-4 border-b flex items-center gap-3 ${
                    alertModal.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' :
                    alertModal.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' :
                    'bg-blue-50 border-blue-100 text-blue-700'
                }`}>
                    {alertModal.type === 'error' && <AlertTriangle className="w-5 h-5" />}
                    {alertModal.type === 'success' && <CheckCircle className="w-5 h-5" />}
                    {alertModal.type === 'info' && <Info className="w-5 h-5" />}
                    <h3 className="font-bold">{alertModal.title}</h3>
                </div>
                <div className="p-6 text-slate-600 text-sm">
                    {alertModal.message}
                </div>
                <div className="p-4 bg-slate-50 border-t flex justify-end">
                    <button 
                        onClick={() => setAlertModal({ ...alertModal, show: false })}
                        className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition"
                    >
                        Entendi
                    </button>
                </div>
            </div>
          </div>
      )}

      {/* 2. Modal de Confirmação (Sim/Não) */}
      {confirmModal.show && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b bg-orange-50 border-orange-100 text-orange-800 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-bold">{confirmModal.title}</h3>
                </div>
                <div className="p-6 text-slate-600 text-sm leading-relaxed">
                    {confirmModal.message}
                </div>
                <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
                    <button 
                        onClick={() => { setConfirmModal({ ...confirmModal, show: false }); fetchData(); }}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-200 font-semibold rounded-lg transition text-sm"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={() => {
                            if(confirmModal.onConfirm) confirmModal.onConfirm();
                            setConfirmModal({ ...confirmModal, show: false });
                        }}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition text-sm"
                    >
                        Sim, Confirmar
                    </button>
                </div>
            </div>
          </div>
      )}

      {/* 3. Modal de Prompt (Input para Resolução) */}
      {promptModal.show && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
               <div className="p-4 border-b bg-blue-50 border-blue-100 flex justify-between items-center">
                   <h3 className="font-bold text-blue-800 flex items-center gap-2">
                       <CheckCircle className="w-5 h-5" /> {promptModal.title}
                   </h3>
                   <button onClick={() => { setPromptModal({...promptModal, show: false}); fetchData(); }} className="text-slate-400 hover:text-red-500 transition">
                       <X className="w-5 h-5" />
                   </button>
               </div>
               <div className="p-6">
                   <label className="block text-sm font-medium text-slate-700 mb-2">Resolução / Solução Aplicada:</label>
                   <textarea 
                       autoFocus
                       rows="4"
                       placeholder={promptModal.placeholder}
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none text-sm"
                       value={promptModal.inputValue}
                       onChange={(e) => setPromptModal({...promptModal, inputValue: e.target.value})}
                   />
               </div>
               <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
                   <button 
                       onClick={() => { setPromptModal({...promptModal, show: false}); fetchData(); }}
                       className="px-4 py-2 text-slate-600 hover:bg-slate-200 font-semibold rounded-lg transition text-sm"
                   >
                       Cancelar
                   </button>
                   <button 
                       disabled={!promptModal.inputValue.trim()}
                       onClick={() => {
                           if(promptModal.onConfirm) promptModal.onConfirm(promptModal.inputValue);
                           setPromptModal({...promptModal, show: false});
                       }}
                       className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold rounded-lg transition text-sm"
                   >
                       Salvar e Concluir
                   </button>
               </div>
           </div>
         </div>
      )}

      {/* ==================== FIM DOS MODAIS ==================== */}

      {/* Header */}
        <header className="bg-blue-700 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Wrench className="w-6 h-6" />
                    <h1 className="text-xl font-bold tracking-tight">Patrimônio TI - Prefeitura</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm bg-blue-800 px-3 py-1 rounded-full font-medium">Olá, {user?.nome}</span>
                    <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-1 hover:text-red-300 transition" 
                    title="Sair do sistema"
                    >
                    <LogOut className="w-5 h-5" />
                    </button>
                </div>
                </div>
            </header>

      {/* Menu de Abas */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-6">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`py-4 px-2 font-semibold flex items-center gap-2 border-b-2 text-sm transition ${
              activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Painel Operacional
          </button>
          <button 
            onClick={() => setActiveTab('usuarios')}
            className={`py-4 px-2 font-semibold flex items-center gap-2 border-b-2 text-sm transition ${
              activeTab === 'usuarios' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" /> Gerenciar Servidores ({usersList.length})
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* ABA 1: PAINEL OPERACIONAL */}
        {activeTab === 'dashboard' && (
          <>
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div 
                onClick={() => setStatusFilter('Todos')}
                className={`bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 cursor-pointer transition transform hover:scale-[1.01] ${
                  statusFilter === 'Todos' ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'
                }`}
              >
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><Monitor className="w-8 h-8" /></div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total de Equipamentos</p>
                  <p className="text-2xl font-bold text-slate-800">{equipments.length}</p>
                </div>
              </div>

              <div 
                onClick={() => setStatusFilter('Aberto')}
                className={`bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 cursor-pointer transition transform hover:scale-[1.01] ${
                  statusFilter === 'Aberto' ? 'border-red-600 ring-2 ring-red-100' : 'border-slate-200'
                }`}
              >
                <div className="bg-red-100 p-3 rounded-lg text-red-600"><Ticket className="w-8 h-8" /></div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Chamados Abertos</p>
                  <p className="text-2xl font-bold text-slate-800">{chamadosAbertos}</p>
                </div>
              </div>

              <div 
                onClick={() => setStatusFilter('Concluído')}
                className={`bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 cursor-pointer transition transform hover:scale-[1.01] ${
                  statusFilter === 'Concluído' ? 'border-green-600 ring-2 ring-green-100' : 'border-slate-200'
                }`}
              >
                <div className="bg-green-100 p-3 rounded-lg text-green-600"><CheckCircle className="w-8 h-8" /></div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Chamados Resolvidos</p>
                  <p className="text-2xl font-bold text-slate-800">{chamadosResolvidos}</p>
                </div>
              </div>
            </div>

            {/* Tabela de Equipamentos */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  {showAllEquipments ? 'Todos os Equipamentos' : 'Equipamentos Cadastrados Recentes'}
                  
                  {equipments.length > 5 && (
                    <button 
                      onClick={() => setShowAllEquipments(!showAllEquipments)}
                      className="text-xs font-normal text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2 py-0.5 rounded transition ml-2"
                    >
                      {showAllEquipments ? 'Ver apenas recentes' : 'Exibir todos'}
                    </button>
                  )}
                </h2>
                
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition"
                >
                  <Plus className="w-4 h-4" /> Novo Equipamento
                </button>
              </div>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-medium border-b sticky top-0">
                    <tr>
                      <th className="py-3 px-4">Patrimônio (Plaqueta)</th>
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Local / Observação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...equipments]
                      .sort((a, b) => b.id - a.id)
                      .slice(0, showAllEquipments ? equipments.length : 5) 
                      .map((eq) => (
                      <tr key={eq.id} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-slate-800">{eq.patrimonio}</td>
                        <td className="py-3 px-4">{eq.tipo}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            eq.status === 'Disponível' ? 'bg-green-100 text-green-700' : 
                            (eq.status === 'Em Manutenção' || eq.status === 'Aberto') ? 'bg-blue-100 text-blue-700' : 
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {eq.status === 'Em Manutenção' ? 'Aberto' : eq.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 truncate max-w-xs">{eq.observacao}</td>
                      </tr>
                    ))}
                    {equipments.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-4 text-center text-slate-500">Nenhum equipamento cadastrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabela de Chamados Expandível */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-8">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-lg font-bold text-slate-800">
                  Gestão de Chamados 
                  {statusFilter !== 'Todos' && <span className="text-sm font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded ml-2">Filtrado por: {statusFilter}</span>}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-medium border-b">
                    <tr>
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4">Solicitante</th>
                      <th className="py-3 px-4">Patrimônio</th>
                      <th className="py-3 px-4">Local / Setor</th>
                      <th className="py-3 px-4 w-1/3">Problema Relatado</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...tickets]
                      .sort((a, b) => b.id - a.id)
                      .filter(tk => statusFilter === 'Todos' || tk.status_chamado === statusFilter)
                      .map((tk) => {
                        const eq = equipments.find(e => e.id === tk.equipment_id);
                        const isExpanded = !!expandedTickets[tk.id];
                        const solicitante = usersList.find(u => u.id === tk.user_id); 

                        return (
                          <tr key={tk.id} className="border-b hover:bg-slate-50 vertical-align-top">
                            <td className="py-3 px-4 whitespace-nowrap">{tk.data_abertura ? new Date(tk.data_abertura).toLocaleDateString('pt-BR') : 'Sem data'}</td>
                            <td className="py-3 px-4 font-semibold text-slate-800">
                              {solicitante ? solicitante.nome : 'Usuário Deletado'}
                            </td>
                            <td className="py-3 px-4 font-semibold text-blue-600">{eq ? eq.patrimonio : `ID: ${tk.equipment_id}`}</td>
                            <td className="py-3 px-4 text-slate-700 font-medium">{eq ? eq.observacao : 'Não informado'}</td>
                            
                            <td className="py-3 px-3 max-w-xs">
                              <div className="text-slate-600 break-words">
                                {isExpanded 
                                ? tk.descricao_problema 
                                : tk.descricao_problema.length > 50 
                                    ? `${tk.descricao_problema.substring(0, 50)}...` 
                                    : tk.descricao_problema}
                              </div>
                              {tk.descricao_problema.length > 50 && (
                                <button 
                                onClick={() => toggleExpandirChamado(tk.id)} 
                                className="text-xs text-blue-600 hover:underline font-semibold block mt-1"
                                >
                                {isExpanded ? 'Ver menos' : 'Ver mais'}
                                </button>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <select 
                                value={tk.status_chamado}
                                disabled={tk.status_chamado !== 'Aberto'}
                                onChange={(e) => handleAlterarStatusChamado(tk.id, tk.status_chamado, e.target.value)}
                                title={tk.status_chamado !== 'Aberto' ? 'Histórico trancado. Não é possível alterar um chamado finalizado.' : 'Alterar status do chamado'}
                                className={`px-2 py-1 rounded-full text-xs font-bold border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                                  tk.status_chamado === 'Aberto' 
                                    ? 'bg-blue-100 text-blue-700 border-blue-200 cursor-pointer' 
                                    : tk.status_chamado === 'Concluído' 
                                      ? 'bg-green-100 text-green-700 border-green-200 appearance-none cursor-default' 
                                      : 'bg-slate-200 text-slate-700 border-slate-300 appearance-none cursor-default'
                                }`}
                              >
                                <option value="Aberto">Aberto</option>
                                <option value="Concluído">Concluído</option>
                                <option value="Baixa">Baixa</option>
                              </select>
                            </td>
                            
                            <td className="py-3 px-4">
                              {tk.status_chamado === 'Aberto' && <span className="text-xs text-blue-500 font-medium">Pendente</span>}
                              {tk.status_chamado === 'Concluído' && <span className="text-xs text-slate-400">Resolvido</span>}
                              {tk.status_chamado === 'Baixa' && <span className="text-xs text-slate-400 font-bold">Encerrado</span>}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ABA 2: GERENCIAMENTO DE USUÁRIOS INTERATIVO */}
        {activeTab === 'usuarios' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Controle de Acesso dos Servidores</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-medium border-b">
                  <tr>
                    <th className="py-3 px-4">Nome Funcionário</th>
                    <th className="py-3 px-4">E-mail Institucional</th>
                    <th className="py-3 px-4">Nível de Acesso (Role)</th>
                    <th className="py-3 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((us) => (
                    <tr key={us.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-800">{us.nome}</td>
                      <td className="py-3 px-4">{us.email}</td>
                      
                      <td className="py-3 px-4">
                        <select 
                          value={us.role}
                          disabled={us.id === user.id}
                          onChange={(e) => handleAlterarRole(us.id, e.target.value)}
                          className={`px-2 py-1 rounded font-bold text-xs bg-white border cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none ${
                            us.role === 'ADMIN' ? 'text-purple-700 border-purple-200 bg-purple-50' : 'text-blue-700 border-blue-200 bg-blue-50'
                          } disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                          <option value="USER">USER (Funcionário)</option>
                          <option value="ADMIN">ADMIN (Suporte TI)</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 flex justify-center gap-2">
                        <button 
                          onClick={() => handleDeletarUsuario(us.id, us.nome)}
                          className="text-red-600 hover:text-red-800 p-1 rounded transition disabled:opacity-40"
                          disabled={us.id === user.id}
                          title="Remover acesso"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL DE CADASTRO DE EQUIPAMENTO ORIGINAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Cadastrar Novo Equipamento</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 transition">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleCadastrarEquipamento} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nº do Patrimônio (P.M.I.S - 5 Dígitos)</label>
                  <input 
                    type="text" required maxLength={5} placeholder="Ex: 46585"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                    value={novoEq.patrimonio}
                    onChange={(e) => setNovoEq({...novoEq, patrimonio: e.target.value.replace(/\D/g, '')})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Equipamento</label>
                  <select required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" value={novoEq.tipo} onChange={(e) => setNovoEq({...novoEq, tipo: e.target.value})}>
                    <option value="">Selecione...</option>
                    <option value="Computador Desktop">Computador Desktop</option>
                    <option value="Notebook">Notebook</option>
                    <option value="Impressora">Impressora</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Telefone IP">Telefone IP</option>
                    <option value="Projetor">Projetor</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Localização / Observação</label>
                  <input type="text" required placeholder="Ex: Gabinete do Prefeito" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" value={novoEq.observacao} onChange={(e) => setNovoEq({...novoEq, observacao: e.target.value})}/>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg transition">Cancelar</button>
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">Salvar Equipamento</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}