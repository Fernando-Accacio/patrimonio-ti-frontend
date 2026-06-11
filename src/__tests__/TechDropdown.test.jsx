import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TechDropdown from '../components/admin/dropdowns/TechDropdown';

describe('Componente TechDropdown', () => {

  const mockTecnicos = [
    { id: 1, nome: 'João TI', ramal: '123' },
    { id: 2, nome: 'Maria Suporte', ramal: null }
  ];

  it('1. Deve renderizar bloqueado se o chamado estiver finalizado', () => {
    render(<TechDropdown ticketId={1} tecnicos={mockTecnicos} atualTecnico={mockTecnicos[0]} isFinalizado={true} onAssignTechnician={() => {}} />);
    
    expect(screen.getByText('João TI')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull(); // Não pode ser clicável
  });

  it('2. Deve renderizar "Sem Responsável" se finalizado e sem técnico', () => {
    render(<TechDropdown ticketId={2} tecnicos={mockTecnicos} atualTecnico={null} isFinalizado={true} onAssignTechnician={() => {}} />);
    expect(screen.getByText('Sem Responsável')).toBeInTheDocument();
  });

  it('3. Deve abrir o menu, listar técnicos e permitir a seleção', () => {
    const mockAssign = vi.fn();
    render(<TechDropdown ticketId={3} tecnicos={mockTecnicos} atualTecnico={null} isFinalizado={false} onAssignTechnician={mockAssign} />);

    // Botão deve mostrar "Aguardando..." quando null
    const mainButton = screen.getByRole('button', { name: /Aguardando/i });
    fireEvent.click(mainButton);

    // Verifica se as opções e ramais apareceram
    expect(screen.getByText('João TI')).toBeInTheDocument();
    expect(screen.getByText('Ramal: 123')).toBeInTheDocument();

    // Clica no técnico João
    fireEvent.click(screen.getByText('João TI'));

    // Verifica se a função disparou com o ID do João
    expect(mockAssign).toHaveBeenCalledWith(3, 1);
  });

  it('4. Deve permitir remover o técnico (Voltar para Aguardando)', () => {
    const mockAssign = vi.fn();
    render(<TechDropdown ticketId={4} tecnicos={mockTecnicos} atualTecnico={mockTecnicos[0]} isFinalizado={false} onAssignTechnician={mockAssign} />);

    // Abre o menu clicando no nome atual
    fireEvent.click(screen.getByRole('button', { name: /João TI/i }));

    // Clica na opção de remover
    fireEvent.click(screen.getByText('Aguardando...'));

    // Verifica se a função disparou mandando string vazia (remoção)
    expect(mockAssign).toHaveBeenCalledWith(4, "");
  });

  it('5. Deve renderizar invertido (para cima) se for o último (isLast)', () => {
    const { container } = render(<TechDropdown ticketId={5} tecnicos={mockTecnicos} atualTecnico={null} isFinalizado={false} isLast={true} onAssignTechnician={() => {}} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Aguardando/i }));
    expect(container.querySelector('.bottom-full')).toBeInTheDocument();
  });

  it('6. Deve fechar ao clicar no fundo da tela', () => {
    const { container } = render(<TechDropdown ticketId={6} tecnicos={mockTecnicos} atualTecnico={null} isFinalizado={false} onAssignTechnician={() => {}} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Aguardando/i }));
    fireEvent.click(container.querySelector('.fixed.inset-0'));
    
    expect(screen.queryByText('João TI')).toBeNull();
  });

});