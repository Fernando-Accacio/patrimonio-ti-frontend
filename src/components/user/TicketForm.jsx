import React, { useState, useEffect } from 'react';
import { Send, X, ChevronDown, Wrench, Building, Search } from 'lucide-react';
import api from '../../services/api'; // Certifique-se de que o caminho do import da api está correto

export default function TicketForm({
  editingTicketId, onCancel, onSubmit,
  patrimonio, setPatrimonio, tipo, setTipo, localizacao, setLocalizacao, descricao, setDescricao,
  tecnicosDisponiveis, tecnicoIdSelecionado, setTecnicoIdSelecionado
}) {
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 🌟 Novos estados para os dados vindos do banco
  const [setoresDB, setSetoresDB] = useState([]);
  const [tiposDB, setTiposDB] = useState([]);

  // 🌟 Busca os setores e tipos ao carregar o componente
  useEffect(() => {
    const fetchApoio = async () => {
      try {
        const [resSetores, resTipos] = await Promise.all([
          api.get('/sectors'),
          api.get('/equipment-types')
        ]);
        setSetoresDB(resSetores.data);
        setTiposDB(resTipos.data);
      } catch (error) {
        console.error("Erro ao buscar setores e equipamentos:", error);
      }
    };
    fetchApoio();
  }, []);

  const filteredSectors = setoresDB.filter(setor =>
    setor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setor.prefixo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectSector = (id) => {
    setLocalizacao(id); // Agora salva o ID (Foreign Key)
    setShowSectorModal(false);
    setSearchTerm('');
  };

  // Encontra o nome do setor selecionado para exibir no input do formulário
  const setorSelecionado = setoresDB.find(s => s.id === localizacao);
  const nomeSetorExibicao = setorSelecionado ? setorSelecionado.nome : '';

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
      <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex justify-between items-center">
        <span>{editingTicketId ? `Editar Chamado #${editingTicketId}` : 'Abrir Novo Chamado'}</span>
        {editingTicketId && (
          <button type="button" onClick={onCancel} className="text-xs text-red-500 hover:underline flex items-center gap-0.5 cursor-pointer">
            <X className="w-3 h-3" /> Cancelar
          </button>
        )}
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nº do Patrimônio (P.M.I.S)</label>
          <input
            type="text" required maxLength={11} placeholder="Ex: 46585"
            className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 outline-none text-sm transition"
            value={patrimonio}
            onChange={(e) => setPatrimonio(e.target.value.replace(/\D/g, '').slice(0, 11))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo do Equipamento</label>
          <div className="relative">
            <select
              required
              className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 outline-none bg-white appearance-none pr-10 text-sm transition cursor-pointer"
              value={tipo}
              onChange={(e) => setTipo(Number(e.target.value))} // 🌟 Converte para número (ID)
            >
              <option value="">Selecione o tipo...</option>
              {tiposDB.map((eqp) => (
                <option key={eqp.id} value={eqp.id}>{eqp.nome}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Seu Setor / Departamento</label>
          <div className="relative flex gap-2">
            <input
              type="text"
              required
              readOnly
              placeholder="Clique para selecionar o setor..."
              className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 outline-none text-sm transition bg-slate-50 cursor-pointer text-slate-800 font-medium"
              value={nomeSetorExibicao} // 🌟 Mostra o nome, mas o estado guarda o ID!
              onClick={() => setShowSectorModal(true)}
            />
            <button
              type="button"
              onClick={() => setShowSectorModal(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Building className="w-3.5 h-3.5" /> Selecionar
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descreva o Problema</label>
          <textarea
            required rows="4" placeholder="Explique o que aconteceu com o aparelho..."
            className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 outline-none resize-none text-sm transition"
            value={descricao} onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        {/* ESCOLHER O TÉCNICO DE PREFERÊNCIA */}
        <div className="bg-slate-50 p-3 border border-slate-200 rounded-lg">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <Wrench className="w-4 h-4 text-blue-600" /> Atendimento Preferencial
          </label>
          <div className="relative">
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 outline-none bg-white appearance-none pr-10 text-xs transition cursor-pointer"
              value={tecnicoIdSelecionado}
              onChange={(e) => setTecnicoIdSelecionado(e.target.value)}
            >
              <option value="">Nenhuma preferência (Aguardar Fila Geral)</option>
              {tecnicosDisponiveis?.map(tec => (
                <option key={tec.id} value={tec.id}>{tec.nome}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 leading-tight">
            Se você já tratou deste caso com algum técnico específico, selecione-o aqui para rotear o chamado diretamente.
          </p>
          {tecnicoIdSelecionado && (
            <p className="mt-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] leading-tight font-medium text-amber-800">
              Aviso: ao vincular este chamado a um técnico específico, ele seguirá como <strong>Em Andamento</strong> e não poderá mais ser editado após o envio.
            </p>
          )}
        </div>

        <button type="submit" className={`w-full text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer shadow-sm ${
          editingTicketId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'
        }`}>
          <Send className="w-4 h-4" /> {editingTicketId ? 'Salvar Alterações' : 'Enviar Solicitação para a TI'}
        </button>
      </form>

      {/* 🌟 MODAL DE SELEÇÃO DE SETORES */}
      {showSectorModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                <h3 className="text-md font-bold text-slate-800">Selecione o seu Setor</h3>
              </div>
              <button
                type="button"
                onClick={() => { setShowSectorModal(false); setSearchTerm(''); }}
                className="text-slate-400 hover:text-red-500 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Input de Busca */}
            <div className="p-4 border-b bg-slate-50/50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquise o setor pelo nome ou sigla..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Lista de Setores */}
            <div className="max-h-64 overflow-y-auto p-4 space-y-1">
              {filteredSectors.length > 0 ? (
                filteredSectors.map((setor) => (
                  <button
                    key={setor.id}
                    type="button"
                    onClick={() => handleSelectSector(setor.id)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">{setor.nome}</span>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 bg-slate-100 group-hover:bg-blue-100 px-2 py-0.5 rounded">
                      {setor.prefixo}
                    </span>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-xs text-slate-400">Nenhum setor encontrado para "{searchTerm}".</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => { setShowSectorModal(false); setSearchTerm(''); }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold py-2 px-4 rounded-lg transition cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}