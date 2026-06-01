import React from 'react';
import { Send, X, ChevronDown } from 'lucide-react'; // Importado o ChevronDown

export default function TicketForm({ 
  editingTicketId, onCancel, onSubmit, mensagem, 
  patrimonio, setPatrimonio, tipo, setTipo, localizacao, setLocalizacao, descricao, setDescricao 
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
      
      {mensagem.texto && (
        <div className={`mb-4 p-3 rounded text-sm ${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nº do Patrimônio (P.M.I.S)</label>
          <input 
            type="text" required maxLength={7} placeholder="Ex: 4658599"
            className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 outline-none text-sm transition"
            value={patrimonio}
            onChange={(e) => setPatrimonio(e.target.value.replace(/\D/g, ''))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo do Equipamento</label>
          {/* Container relativo criado para controlar a posição da nova seta */}
          <div className="relative">
            <select 
              required 
              // Adicionado 'appearance-none' para sumir com a seta antiga e 'pr-10' para o texto não sobrepor o ícone
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
            
            {/* Nova flechinha customizada jogada mais para a esquerda com 'right-4' */}
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

        <button type="submit" className={`w-full text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition cursor-pointer ${
          editingTicketId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'
        }`}>
          <Send className="w-4 h-4" /> {editingTicketId ? 'Salvar Alterações' : 'Enviar para a TI'}
        </button>
      </form>
    </div>
  );
}