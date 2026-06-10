import React, { useState } from 'react';
import { User } from 'lucide-react';

export default function TechDropdown({ ticketId, tecnicos, atualTecnico, isFinalizado, onAssignTechnician, isLast }) {
  const [isOpen, setIsOpen] = useState(false);

  if (isFinalizado) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg bg-slate-100 text-slate-700 border-slate-300 text-xs font-bold w-full justify-center shadow-xs">
        <User className="w-3.5 h-3.5 text-slate-500" />
        <span>{atualTecnico ? atualTecnico.nome : 'Sem Responsável'}</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full text-left ${isOpen ? 'z-50' : 'z-10'}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`text-xs font-bold border rounded-lg px-3 py-2.5 w-full text-left flex items-center justify-between bg-white cursor-pointer transition ${
          atualTecnico ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}
      >
        <span>{atualTecnico ? atualTecnico.nome : 'Aguardando...'}</span>
        <span className="text-slate-400 text-[10px]">{isLast ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className={`absolute left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-100 animate-in fade-in duration-150 ${
            isLast ? 'bottom-full mb-1 slide-in-from-bottom-2' : 'top-full mt-1 slide-in-from-top-2'
          }`}>
            <button type="button" onClick={() => { onAssignTechnician(ticketId, ""); setIsOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-50 transition cursor-pointer">
              Aguardando...
            </button>
            {tecnicos.map(tec => (
              <button key={tec.id} type="button" onClick={() => { onAssignTechnician(ticketId, tec.id); setIsOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 transition flex flex-col gap-0.5 cursor-pointer">
                <span className="text-xs font-bold text-slate-700">{tec.nome}</span>
                {tec.ramal && <span className="text-[10px] font-semibold text-slate-400">Ramal: {tec.ramal}</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}