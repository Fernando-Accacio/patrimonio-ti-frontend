import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { LogOut, MonitorSmartphone, Send, Edit2, X } from 'lucide-react';

export default function UserDashboard() {
  const { user, logoutContext } = useContext(AuthContext);
  const navigate = useNavigate();

  // ESTADOS BASE
  const [meusChamados, setMeusChamados] = useState([]);
  const [equipments, setEquipments] = useState([]); // Baixa as máquinas para cruzar a numeração do patrimônio
  const [patrimonio, setPatrimonio] = useState('');
  const [tipo, setTipo] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  // ESTADOS DE INTERAÇÃO
  const [editingTicketId, setEditingTicketId] = useState(null);
  const [expandedTickets, setExpandedTickets] = useState({}); // Controla o "ver mais" do usuário

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
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
  };

  const toggleExpandirChamado = (id) => {
    setExpandedTickets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleIniciarEdicao = (ticket) => {
    setEditingTicketId(ticket.id);
    setDescricao(ticket.descricao_problema);
    setMensagem({ tipo: '', texto: '' });
  };

  const handleCancelarEdicao = () => {
    setEditingTicketId(null);
    setDescricao('');
    setPatrimonio('');
    setTipo('');
    setLocalizacao('');
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });

    try {
      if (editingTicketId) {
        await api.put(`/tickets/${editingTicketId}`, {
          descricao_problema: descricao
        });
        setMensagem({ tipo: 'sucesso', texto: 'Relato do problema atualizado com sucesso!' });
      } else {
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
      setMensagem({ 
        tipo: 'erro', 
        texto: error.response?.data?.error || 'Erro ao processar a requisição.' 
      });
    }
  };

  const handleLogout = () => {
    logoutContext();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MonitorSmartphone className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight">Portal do Servidor - Suporte TI</h1>
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

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Formulário */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex justify-between items-center">
            <span>{editingTicketId ? `Editar Chamado #${editingTicketId}` : 'Abrir Novo Chamado'}</span>
            {editingTicketId && (
              <button onClick={handleCancelarEdicao} className="text-xs text-red-500 hover:underline flex items-center gap-0.5">
                <X className="w-3 h-3" /> Cancelar
              </button>
            )}
          </h2>
          
          {mensagem.texto && (
            <div className={`mb-4 p-3 rounded text-sm ${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={handleSubmitForm} className="space-y-4">
            {!editingTicketId ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nº do Patrimônio (P.M.I.S)</label>
                  <input 
                    type="text" required maxLength={5} placeholder="Ex: 46585"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-600 outline-none"
                    value={patrimonio}
                    onChange={(e) => setPatrimonio(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo do Equipamento</label>
                  <select 
                    required className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-600 outline-none bg-white"
                    value={tipo} onChange={(e) => setTipo(e.target.value)}
                  >
                    <option value="">Selecione o tipo...</option>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Seu Setor / Departamento</label>
                  <input 
                    type="text" required placeholder="Ex: Almoxarifado Central"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-600 outline-none"
                    value={localizacao} onChange={(e) => setLocalizacao(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-500 mb-2">
                ⚠️ O patrimônio associado a este chamado não pode ser alterado. Mude apenas a descrição.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descreva o Problema</label>
              <textarea 
                required rows="4" placeholder="Explique o que aconteceu com o aparelho..."
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                value={descricao} onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <button type="submit" className={`w-full text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition ${
              editingTicketId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}>
              <Send className="w-4 h-4" /> {editingTicketId ? 'Salvar Alterações' : 'Enviar para a TI'}
            </button>
          </form>
        </div>

        {/* Histórico com a Nova Coluna Patrimônio */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Meus Chamados Recentes</h2>
          {/* Adicionado max-h e overflow-y para criar a barra de rolagem igual do Admin */}
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto pr-2">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 border-b sticky top-0 z-10">
                <tr>
                  <th className="py-2 px-3">Data</th>
                  <th className="py-2 px-3">Patrimônio</th> 
                  <th className="py-2 px-3 w-1/2">Problema</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {[...meusChamados].sort((a,b) => b.id - a.id).map(ticket => {
                  const matchedEq = equipments.find(e => e.id === ticket.equipment_id);
                  const isExpanded = !!expandedTickets[ticket.id];
                  return (
                    // TROCADO vertical-align-top POR align-top (Classe oficial do Tailwind)
                    <tr key={ticket.id} className="border-b hover:bg-slate-50 align-top">
                      <td className="py-3 px-3 whitespace-nowrap pt-4">
                        {ticket.data_abertura ? new Date(ticket.data_abertura).toLocaleDateString('pt-BR') : 'Sem data'}
                      </td>
                      
                      <td className="py-3 px-3 font-semibold text-slate-700 pt-4">
                        {matchedEq ? matchedEq.patrimonio : `ID: ${ticket.equipment_id}`}
                      </td>

                      <td className="py-3 px-3 max-w-xs pt-4">
                        <div className="text-slate-600 break-words">
                          {isExpanded 
                            ? ticket.descricao_problema 
                            : ticket.descricao_problema.length > 50 
                              ? `${ticket.descricao_problema.substring(0, 50)}...` 
                              : ticket.descricao_problema}
                        </div>
                        {ticket.descricao_problema.length > 50 && (
                          <button 
                            onClick={() => toggleExpandirChamado(ticket.id)} 
                            className="text-xs text-blue-600 hover:underline font-semibold block mt-1"
                          >
                            {isExpanded ? 'Ver menos' : 'Ver mais'}
                          </button>
                        )}

                        {ticket.resolucao_ti && (
                          <div className="mt-3 p-2.5 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 shadow-sm">
                            <strong className="block mb-1 text-green-900 font-bold">Resposta do Suporte TI:</strong>
                            <span className="break-words leading-relaxed">{ticket.resolucao_ti}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 pt-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.status_chamado === 'Concluído' ? 'bg-green-100 text-green-700' : 
                          ticket.status_chamado === 'Baixa' ? 'bg-slate-200 text-slate-700' :
                          'bg-blue-100 text-blue-700' // Azul para Aberto (padrão igual do Admin)
                        }`}>
                          {ticket.status_chamado}
                        </span>
                      </td>
                      
                      <td className="py-3 px-3 text-center pt-4">
                        {ticket.status_chamado === 'Aberto' ? (
                          <button 
                            onClick={() => handleIniciarEdicao(ticket)}
                            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center gap-1 mx-auto text-xs"
                          >
                            <Edit2 className="w-3 h-3" /> Editar
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic font-medium">Trancado</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {meusChamados.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">
                      Você ainda não abriu nenhum chamado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}