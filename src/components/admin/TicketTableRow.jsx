import React, { useState } from 'react';
import { Lock, User, Info, Wrench } from 'lucide-react';

export default function TicketTableRow({ 
  ticket, 
  equipments, 
  usersList, 
  tecnicos, 
  isExpanded, 
  onToggleExpand, 
  onAssignTechnician, 
  onUpdateStatus,
  isLast // 🌟 NOVA PROP: Informa se esta é a última linha da tabela
}) {
  const eq = equipments.find(e => e.id === ticket.equipment_id);
  const dataDoChamado = ticket.createdAt || ticket.data_abertura;

  const [isTechOpen, setIsTechOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false); 
  const atualTecnico = tecnicos.find(tec => tec.id === ticket.tecnico_id);

  const isFinalizado = ['Concluído', 'Baixa', 'Cancelado'].includes(ticket.status_chamado);

  return (
    <tr className={`align-top transition ${(isTechOpen || isStatusOpen) ? 'z-40 relative bg-slate-50' : 'hover:bg-slate-50'}`}>
      <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-500 font-medium leading-tight pt-5">
        {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}
      </td>
      
      {/* Solicitante */}
      <td className="py-4 px-4 pt-5">
        <span className="font-semibold text-slate-800 text-sm block leading-tight">
          {ticket.user ? ticket.user.nome : 'Usuário Removido'}
        </span>
        {ticket.user?.ramal && (
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-1">
            Ramal: {ticket.user.ramal}
          </span>
        )}
      </td>

      {/* Equipamento */}
      <td className="py-4 px-4 pt-5">
        <div className="flex items-center gap-1.5 whitespace-nowrap mb-0.5">
          <span className="font-bold text-blue-600 text-sm">
            {eq ? eq.patrimonio : `ID: ${ticket.equipment_id}`}
          </span>
          {eq?.tipo && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {eq.tipo}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-500 block leading-tight">{eq ? eq.observacao : 'Não informado'}</span>
      </td>
      
      {/* Problema & Resolução Aplicada */}
      <td className="py-4 px-4 pt-5">
        <div className="text-slate-600 break-words text-sm leading-relaxed">
          {isExpanded ? ticket.descricao_problema : ticket.descricao_problema.length > 50 ? `${ticket.descricao_problema.substring(0, 50)}...` : ticket.descricao_problema}
        </div>
        {ticket.descricao_problema.length > 50 && (
          <button onClick={() => onToggleExpand(ticket.id)} className="text-sm text-blue-600 hover:underline font-bold block mt-1 cursor-pointer">
            {isExpanded ? 'Ocultar Detalhes' : 'Ler Relato Completo'}
          </button>
        )}

        {ticket.resolucao_ti && (
          <div className={`mt-3 p-3 border border-slate-200 border-l-4 rounded-r-lg text-sm shadow-xs bg-slate-50 ${
            ticket.status_chamado === 'Cancelado' ? 'border-l-slate-400' : 'border-l-emerald-500'
          }`}>
            <strong className={`flex items-center gap-1.5 mb-1 font-bold text-xs uppercase tracking-wider ${
              ticket.status_chamado === 'Cancelado' ? 'text-slate-500' : 'text-emerald-700'
            }`}>
              {ticket.status_chamado === 'Cancelado' 
                ? <><Info className="w-3.5 h-3.5" /> Motivo do Cancelamento:</> 
                : <><Wrench className="w-3.5 h-3.5" /> Resolução Aplicada:</>
              }
            </strong>
            <p className="font-medium text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-slate-100 mt-1 break-words">
              {ticket.resolucao_ti}
            </p>
          </div>
        )}
      </td>

      {/* Responsável TI */}
      <td className="py-4 px-4 text-center align-middle min-w-[220px] pt-4">
        {isFinalizado ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg bg-slate-100 text-slate-700 border-slate-300 text-xs font-bold w-full justify-center shadow-xs">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>{atualTecnico ? atualTecnico.nome : 'Sem Responsável'}</span>
          </div>
        ) : (
          <div className="relative w-full text-left z-30">
            <button
              type="button"
              onClick={() => setIsTechOpen(!isTechOpen)}
              className={`text-xs font-bold border rounded-lg px-3 py-2.5 w-full text-left flex items-center justify-between bg-white cursor-pointer transition ${
                ticket.tecnico_id ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              <span>{atualTecnico ? atualTecnico.nome : 'Aguardando...'}</span>
              <span className="text-slate-400 text-[10px]">▼</span>
            </button>

            {isTechOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsTechOpen(false)} />
                {/* 🌟 DINÂMICO: Abre pra cima se for o último, senão abre pra baixo */}
                <div className={`absolute left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-xl z-30 max-h-60 overflow-y-auto divide-y divide-slate-100 animate-in fade-in duration-150 ${
                  isLast ? 'bottom-full mb-1 slide-in-from-bottom-2' : 'top-full mt-1 slide-in-from-top-2'
                }`}>
                  <button type="button" onClick={() => { onAssignTechnician(ticket.id, ""); setIsTechOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition cursor-pointer">
                    Aguardando...
                  </button>
                  {tecnicos.map(tec => (
                    <button key={tec.id} type="button" onClick={() => { onAssignTechnician(ticket.id, tec.id); setIsTechOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 transition flex flex-col gap-0.5 cursor-pointer">
                      <span className="text-xs font-bold text-slate-700">{tec.nome}</span>
                      {tec.ramal && <span className="text-[10px] font-semibold text-slate-400">Ramal: {tec.ramal}</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </td>

      {/* STATUS DROPDOWN */}
      <td className="py-4 px-4 text-center align-middle min-w-[170px] pt-4">
        {isFinalizado ? (
          <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border w-full justify-center shadow-xs ${
            ticket.status_chamado === 'Concluído' ? 'bg-green-100 text-green-800 border-green-300' :
            ticket.status_chamado === 'Baixa' ? 'bg-red-100 text-red-800 border-red-300' :
            'bg-slate-200 text-slate-800 border-slate-400'
          }`}>
            <Lock className="w-3.5 h-3.5 shrink-0 opacity-80" />
            <span>{ticket.status_chamado}</span>
          </div>
        ) : (
          <div className="relative w-full text-left z-30">
            <button
              type="button"
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className={`px-3 py-2.5 rounded-lg text-xs font-bold border outline-none transition flex items-center justify-between w-full bg-white cursor-pointer ${
                ticket.status_chamado === 'Aberto' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              <span>{ticket.status_chamado}</span>
              <span className="text-slate-400 text-[10px]">▼</span>
            </button>

            {isStatusOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsStatusOpen(false)} />
                {/* 🌟 DINÂMICO: Abre pra cima se for o último, senão abre pra baixo */}
                <div className={`absolute left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-xl z-30 overflow-hidden divide-y divide-slate-100 animate-in fade-in duration-150 ${
                  isLast ? 'bottom-full mb-1 slide-in-from-bottom-2' : 'top-full mt-1 slide-in-from-top-2'
                }`}>
                  {[
                    { value: 'Aberto', style: 'text-yellow-700 hover:bg-yellow-50', requerTecnico: false },
                    { value: 'Em Andamento', style: 'text-blue-700 hover:bg-blue-50', requerTecnico: false },
                    { value: 'Concluído', style: 'text-green-700 hover:bg-green-50', requerTecnico: true },
                    { value: 'Baixa', style: 'text-red-700 hover:bg-red-50', requerTecnico: true }
                  ].map(opt => {
                    const isBlocked = opt.requerTecnico && !ticket.tecnico_id;
                    
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          if (isBlocked) {
                            alert("⚠️ Operação Negada:\n\nÉ obrigatório atribuir um Responsável (TI) ao chamado antes de marcá-lo como Concluído ou Baixa.");
                            return;
                          }
                          onUpdateStatus(ticket.id, ticket.status_chamado, opt.value);
                          setIsStatusOpen(false);
                        }}
                        className={`w-full flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-bold transition ${
                          isBlocked ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' : `cursor-pointer ${opt.style}`
                        }`}
                      >
                        {opt.value} 
                        {/* 🌟 ÍCONE LUCIDE: Substituindo o emoji de cadeado */}
                        {isBlocked && <Lock className="w-3.5 h-3.5 text-slate-400 mb-0.5" />}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}