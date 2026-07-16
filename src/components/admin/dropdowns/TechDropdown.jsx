import React, { useEffect, useRef, useState } from 'react';
import { User } from 'lucide-react';

export default function TechDropdown({ ticketId, tecnicos, atualTecnico, isFinalizado, onAssignTechnician, isLast, isLastTech }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState('down');
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const maxVisibleMenuHeight = 240;
  const shouldPreferOpenUp = isLastTech ?? isLast;

  const estimateMenuHeight = (tecnicos.length + 1) * 46;

  const calculateOpenDirection = () => {
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    if (!buttonRect) {
      return shouldPreferOpenUp ? 'up' : 'down';
    }

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    const menuHeight = Math.min(menuRef.current?.scrollHeight || estimateMenuHeight, maxVisibleMenuHeight);

    if (menuRef.current?.scrollHeight === 0 && buttonRect.top === 0 && buttonRect.bottom === 0) {
      return shouldPreferOpenUp ? 'up' : 'down';
    }

    const shouldOpenUp = shouldPreferOpenUp && spaceBelow < menuHeight + 12 && spaceAbove > spaceBelow;
    return shouldOpenUp ? 'up' : 'down';
  };

  useEffect(() => {
    if (!isOpen) return;

    const updateDirection = () => {
      setOpenDirection(calculateOpenDirection());
    };

    updateDirection();
    window.addEventListener('resize', updateDirection);
    window.addEventListener('scroll', updateDirection, true);

    return () => {
      window.removeEventListener('resize', updateDirection);
      window.removeEventListener('scroll', updateDirection, true);
    };
  }, [estimateMenuHeight, isOpen]);

  if (isFinalizado) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg bg-slate-100 text-slate-700 border-slate-300 text-xs font-bold w-full justify-center shadow-xs">
        <User className="w-3.5 h-3.5 text-slate-500" />
        <span>{atualTecnico ? atualTecnico.nome : 'Sem Responsável'}</span>
      </div>
    );
  }

  return (
    // 🌟 1. Aumentamos o z-index quando aberto para [9999] e removemos z-10 padrão para não bugar a tabela
    <div className={`relative w-full text-left ${isOpen ? 'z-[9999]' : ''}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (!isOpen) {
            setOpenDirection(calculateOpenDirection());
          }
          setIsOpen(!isOpen);
        }}
        className={`text-xs font-bold border rounded-lg px-3 py-2.5 w-full text-left flex items-center justify-between bg-white cursor-pointer transition ${
          atualTecnico ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}
      >
        <span>{atualTecnico ? atualTecnico.nome : 'Aguardando...'}</span>
        <span className="text-slate-400 text-[10px]">{openDirection === 'up' ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} />
          {/* 🌟 2. Adicionamos z-[9999] e fixamos a largura no menu para ele pular pra fora das limitações de corte */}
          <div ref={menuRef} className={`absolute left-0 w-full min-w-[160px] bg-white border border-slate-200 rounded-lg shadow-2xl z-[9999] max-h-60 overflow-y-auto divide-y divide-slate-100 animate-in fade-in duration-150 ${
            openDirection === 'up' ? 'bottom-full mb-1 slide-in-from-bottom-2' : 'top-full mt-1 slide-in-from-top-2'
          }`}>
            <button 
              type="button" 
              onClick={() => { onAssignTechnician(ticketId, null); setIsOpen(false); }} 
              className="w-full text-left px-4 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-50 transition cursor-pointer"
            >
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