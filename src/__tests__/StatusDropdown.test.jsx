import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest'; // 🌟 Importamos o 'vi' para criar funções falsas (mocks)
import StatusDropdown from '../components/admin/dropdowns/StatusDropdown'; 

describe('Componente StatusDropdown', () => {

  // Interceptamos o 'alert' do navegador para o teste não travar esperando alguém clicar em "OK"
  const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

  // Limpamos o histórico do alerta antes de cada teste
  beforeEach(() => {
    alertMock.mockClear();
  });

  it('1. Deve renderizar bloqueado se o chamado estiver finalizado', () => {
    render(<StatusDropdown ticketId={1} currentStatus="Concluído" tecnicoId={5} isFinalizado={true} onUpdateStatus={() => {}} />);
    expect(screen.getByText('Concluído')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull(); 
  });

  it('2. Deve abrir o menu e permitir alterar para "Em Andamento" se houver técnico', () => {
    const mockUpdate = vi.fn(); // Criamos uma função de mentira para ver se ela é chamada
    
    render(<StatusDropdown ticketId={2} currentStatus="Aberto" tecnicoId={10} isFinalizado={false} onUpdateStatus={mockUpdate} />);

    // Clica no botão principal para abrir o dropdown
    const mainButton = screen.getByRole('button', { name: /Aberto/i });
    fireEvent.click(mainButton);

    // Encontra e clica na opção "Em Andamento"
    const optionButton = screen.getByRole('button', { name: /Em Andamento/i });
    fireEvent.click(optionButton);

    // Verifica se a função disparou com os dados corretos!
    expect(mockUpdate).toHaveBeenCalledWith(2, 'Aberto', 'Em Andamento');
  });

  it('3. Deve bloquear conclusão se NÃO houver técnico', () => {
    render(<StatusDropdown ticketId={3} currentStatus="Aberto" tecnicoId={null} isFinalizado={false} onUpdateStatus={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /Aberto/i }));
    fireEvent.click(screen.getByRole('button', { name: /Concluir/i }));

    // Verifica se o nosso alerta de segurança disparou na tela
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('necessário atribuir um Responsável'));
  });

  it('4. Deve bloquear retorno para "Aberto" se JÁ houver técnico', () => {
    render(<StatusDropdown ticketId={4} currentStatus="Em Andamento" tecnicoId={10} isFinalizado={false} onUpdateStatus={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /Em Andamento/i }));
    fireEvent.click(screen.getByRole('button', { name: /Aberto/i }));

    // Verifica se o alerta da trava de retrocesso disparou
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('não pode ficar com o status \'Aberto\''));
  });

  it('5. Deve fechar o menu ao clicar no fundo da tela (overlay)', () => {
    // Usamos o 'container' para conseguir buscar a div invisível do fundo
    const { container } = render(
      <StatusDropdown ticketId={5} currentStatus="Aberto" tecnicoId={10} isFinalizado={false} onUpdateStatus={() => {}} />
    );

    // Abre o dropdown
    fireEvent.click(screen.getByRole('button', { name: /Aberto/i }));

    // Busca a película invisível pela classe CSS e clica nela
    const overlay = container.querySelector('.fixed.inset-0');
    fireEvent.click(overlay);

    // O menu de opções deve ter desaparecido da tela
    expect(screen.queryByText('Em Andamento')).toBeNull();
  });

  it('6. Deve renderizar as cores corretas para o status "Baixa" e o status "Aberto"', () => {
    // Testamos a cor vermelha da 'Baixa' bloqueada (Linhas 10-11)
    const { rerender } = render(<StatusDropdown ticketId={6} currentStatus="Baixa" tecnicoId={5} isFinalizado={true} onUpdateStatus={() => {}} />);
    expect(screen.getByText('Baixa').parentElement).toHaveClass('bg-red-100');

    // Trocamos para 'Em Andamento' finalizado para pegar o fallback cinza (Linhas 10-11)
    rerender(<StatusDropdown ticketId={6} currentStatus="Cancelado" tecnicoId={5} isFinalizado={true} onUpdateStatus={() => {}} />);
    expect(screen.getByText('Cancelado').parentElement).toHaveClass('bg-slate-200');

    // Testamos a cor azul do botão aberto quando o status NÃO é 'Aberto' (Linha 37)
    rerender(<StatusDropdown ticketId={6} currentStatus="Em Andamento" tecnicoId={5} isFinalizado={false} onUpdateStatus={() => {}} />);
    expect(screen.getByRole('button', { name: /Em Andamento/i })).toHaveClass('bg-blue-50');
  });

  it('7. Deve renderizar o menu abrindo para cima quando for o último item (isLast)', () => {
    // Acionamos a prop 'isLast' para testar a classe do menu invertido (Linha 44)
    const { container } = render(<StatusDropdown ticketId={7} currentStatus="Aberto" tecnicoId={5} isFinalizado={false} isLast={true} onUpdateStatus={() => {}} />);
    
    // Abre o dropdown
    fireEvent.click(screen.getByRole('button', { name: /Aberto/i }));
    
    // O menu (a div que segura as opções) agora deve ter a classe 'bottom-full'
    const menuContainer = container.querySelector('.bottom-full');
    expect(menuContainer).toBeInTheDocument();
  });

});