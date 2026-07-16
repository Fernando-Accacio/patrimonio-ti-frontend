import React, { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';

export default function StatusDropdown({ ticketId, currentStatus, tecnicoId, isFinalizado, onUpdateStatus, isLast, solicitanteNome }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState(isLast ? 'up' : 'down');
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const options = [
    { value: 'Aberto', label: 'Aberto', style: 'text-amber-700 hover:bg-amber-50' },
    { value: 'Em Andamento', label: 'Em Andamento', style: 'text-blue-700 hover:bg-blue-50' },
    { value: 'Aguardando Confirmação', label: 'Concluir', style: 'text-purple-700 hover:bg-purple-50' },
    { value: 'Baixa', label: 'Dar Baixa', style: 'text-red-700 hover:bg-red-50' }
  ];

  const estimateMenuHeight = options.length * 45;

  const calculateOpenDirection = () => {
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    if (!buttonRect || (buttonRect.width === 0 && buttonRect.height === 0)) {
      return isLast ? 'up' : 'down';
    }

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    const menuHeight = menuRef.current?.scrollHeight || estimateMenuHeight;

    const shouldOpenUp = spaceBelow < menuHeight + 12 && spaceAbove > spaceBelow;
    return shouldOpenUp ? 'up' : 'down';
  };

  useEffect(() => {
    if (!isOpen) return;

    const updateDirection = () => {
      const buttonRect = buttonRef.current?.getBoundingClientRect();
      if (!buttonRect) return;

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const menuHeight = menuRef.current?.scrollHeight || estimateMenuHeight;

      if (menuRef.current?.scrollHeight === 0 && buttonRect.top === 0 && buttonRect.bottom === 0) {
        return;
      }

      const shouldOpenUp = spaceBelow < menuHeight + 12 && spaceAbove > spaceBelow;

      setOpenDirection(shouldOpenUp ? 'up' : 'down');
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
      <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border w-full justify-center shadow-xs ${
        currentStatus === 'Concluído' ? 'bg-green-100 text-green-800 border-green-300' :
        currentStatus === 'Aguardando Confirmação' ? 'bg-purple-100 text-purple-800 border-purple-300' :
        currentStatus === 'Baixa' ? 'bg-red-100 text-red-800 border-red-300' :
        'bg-slate-200 text-slate-800 border-slate-400'
      }`}>
        <Lock className="w-3.5 h-3.5 shrink-0 opacity-80" />
        {/* 🌟 NOME AMIGÁVEL QUANDO ESTÁ TRAVADO */}
        <span>
          {currentStatus === 'Aguardando Confirmação'
            ? 'Aguardando confirmação do usuário'
            : currentStatus}
        </span>
      </div>
    );
  }

  return (
    // 🌟 1. Ajustado o wrapper para usar z-[9999] quando aberto, garantindo prioridade total
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
        className={`px-3 py-2.5 rounded-lg text-xs font-bold border outline-none transition flex items-center justify-between w-full bg-white cursor-pointer ${
          currentStatus === 'Aberto' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
        }`}
      >
        <span>{currentStatus}</span>
        <span className="text-slate-400 text-[10px]">{openDirection === 'up' ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <>
          {/* 🌟 2. O backdrop fixo que cobre a tela inteira (z-[9998]) */}
          <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} />
          
          {/* 🌟 3. A caixa do menu agora tem z-[9999] e min-w-[160px] */}
          <div ref={menuRef} className={`absolute left-0 w-full min-w-[160px] bg-white border border-slate-200 rounded-lg shadow-2xl z-[9999] overflow-hidden divide-y divide-slate-100 animate-in fade-in duration-150 ${
            openDirection === 'up' ? 'bottom-full mb-1 slide-in-from-bottom-2' : 'top-full mt-1 slide-in-from-top-2'
          }`}>
            {options.map(opt => {
              
              // Bloqueios
              const isBlockedWithoutTech = ['Em Andamento', 'Aguardando Confirmação', 'Baixa'].includes(opt.value) && !tecnicoId;
              const isBlockedToOpen = opt.value === 'Aberto' && tecnicoId; 
              const isBlocked = isBlockedWithoutTech || isBlockedToOpen;
              
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    if (isBlocked) {
                      if (isBlockedToOpen) {
                        window.alert("Um chamado com técnico atribuído não pode ficar com o status 'Aberto'.");
                      } else if (!tecnicoId) {
                        window.alert('É necessário atribuir um Responsável antes de mudar o status do chamado.');
                      }
                      return;
                    }
                    onUpdateStatus(ticketId, currentStatus, opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-bold transition ${
                    isBlocked ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' : `cursor-pointer ${opt.style}`
                  }`}
                >
                  {/* 🌟 RENDERIZANDO A LABEL VISUAL E NÃO O VALUE */}
                  {opt.label} 
                  {isBlocked && <Lock className="w-3.5 h-3.5 text-slate-400 mb-0.5" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  );
}