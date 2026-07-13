import React from 'react';
import { Send, X, ChevronDown, Wrench } from 'lucide-react'; 

export default function TicketForm({ 
  editingTicketId, onCancel, onSubmit, 
  patrimonio, setPatrimonio, tipo, setTipo, localizacao, setLocalizacao, descricao, setDescricao,
  tecnicosDisponiveis, tecnicoIdSelecionado, setTecnicoIdSelecionado // NOVAS PROPS AQUI
}) {
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
              onChange={(e) => setTipo(e.target.value)}
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
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Seu Setor / Departamento</label>
          <input 
            type="text" required placeholder="Ex: Almoxarifado Central"
            className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 outline-none text-sm transition"
            value={localizacao} onChange={(e) => setLocalizacao(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descreva o Problema</label>
          <textarea 
            required rows="4" placeholder="Explique o que aconteceu com o aparelho..."
            className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 outline-none resize-none text-sm transition"
            value={descricao} onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        {/* NOVO CAMPO: ESCOLHER O TÉCNICO DE PREFERÊNCIA */}
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
    </div>
  );
}