import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Login from '../pages/Login';
import { useAuthForm } from '../hooks/useAuthForm';
import api from '../services/api';

// 1. Objeto base dinâmico para simular o hook useAuthForm
const mockHook = {
  email: '',
  setEmail: vi.fn(),
  senha: '',
  setSenha: vi.fn(),
  erro: null,
  showPassword: false,
  setShowPassword: vi.fn(),
  handleLogin: vi.fn((e) => e.preventDefault()),
  navigate: vi.fn(),
};

// 2. Interceptamos o hook e o arquivo de API
vi.mock('../hooks/useAuthForm', () => ({
  useAuthForm: () => mockHook,
}));

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('Página de Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHook.email = '';
    mockHook.senha = '';
    mockHook.erro = null;
    mockHook.showPassword = false;
  });

  it('1. Deve renderizar os elementos iniciais da tela de login corretamente', () => {
    render(<Login />);
    expect(screen.getByText('Prefeitura Municipal')).toBeInTheDocument();
    expect(screen.getByText('Gestão de Patrimônio e Helpdesk')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail Institucional')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Acessar Sistema/i })).toBeInTheDocument();
  });

  it('2. Deve exibir mensagem de erro em vermelho se o hook contiver um erro de login', () => {
    mockHook.erro = 'Usuário ou senha incorretos.';
    render(<Login />);
    expect(screen.getByText('Usuário ou senha incorretos.')).toBeInTheDocument();
  });

  it('3. Deve acionar as funções do formulário ao digitar e tentar submeter', () => {
    render(<Login />);
    
    const emailInput = screen.getByLabelText('E-mail Institucional');
    fireEvent.change(emailInput, { target: { value: 'teste@itapecerica.sp.gov.br' } });
    expect(mockHook.setEmail).toHaveBeenCalledWith('teste@itapecerica.sp.gov.br');

    const form = screen.getByRole('button', { name: /Acessar Sistema/i }).closest('form');
    fireEvent.submit(form);
    expect(mockHook.handleLogin).toHaveBeenCalled();
  });

  it('4. Deve alternar a visibilidade da senha ao clicar no ícone do olho', () => {
    render(<Login />);
    const togglePasswordBtn = screen.getByPlaceholderText('••••••••').nextSibling;
    fireEvent.click(togglePasswordBtn);
    expect(mockHook.setShowPassword).toHaveBeenCalled();
  });

  it('5. Deve redirecionar para a tela de registro ao clicar em "Cadastre-se aqui"', () => {
    render(<Login />);
    const registerBtn = screen.getByText('Cadastre-se aqui');
    fireEvent.click(registerBtn);
    expect(mockHook.navigate).toHaveBeenCalledWith('/register');
  });

  // ==========================================
  // TESTES DO MODAL DE RESET DE SENHA (AUSTUSTADOS POR ÍNDICE 🚀)
  // ==========================================

  it('6. Deve abrir o modal de redefinição, processar envio com SUCESSO e permitir fechar', async () => {
    api.post.mockResolvedValue({}); 
    render(<Login />);
    
    fireEvent.click(screen.getByText('Esqueci minha senha'));

    // Pegamos o segundo input com esse placeholder (o do modal)
    const resetInput = screen.getAllByPlaceholderText('seu.nome@itapecerica.sp.gov.br')[1];
    fireEvent.change(resetInput, { target: { value: 'suporte@itapecerica.sp.gov.br' } });
    
    fireEvent.submit(resetInput.closest('form'));

    await waitFor(() => {
      expect(screen.getByText('Solicitação Pendente!')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Fechar Janela/i }));
    expect(screen.queryByText('Recuperação de Acesso')).toBeNull();
  });

  it('7. Tradutor de Erros: Deve exibir mensagem amigável para erro de formato (Bad Request / Validation error)', async () => {
    api.post.mockRejectedValue({
      response: { data: { error: 'Bad Request' } }
    });
    render(<Login />);
    
    fireEvent.click(screen.getByText('Esqueci minha senha'));
    
    const resetInput = screen.getAllByPlaceholderText('seu.nome@itapecerica.sp.gov.br')[1];
    fireEvent.submit(resetInput.closest('form'));

    await waitFor(() => {
      expect(screen.getByText('Formato de e-mail inválido. Verifique se você digitou corretamente.')).toBeInTheDocument();
    });
  });

  it('8. Tradutor de Erros: Deve exibir mensagem amigável para usuário inexistente (User not found)', async () => {
    api.post.mockRejectedValue({
      response: { data: { error: 'User not found' } }
    });
    render(<Login />);
    
    fireEvent.click(screen.getByText('Esqueci minha senha'));
    
    const resetInput = screen.getAllByPlaceholderText('seu.nome@itapecerica.sp.gov.br')[1];
    fireEvent.submit(resetInput.closest('form'));

    await waitFor(() => {
      expect(screen.getByText('Nenhum servidor encontrado com este endereço de e-mail.')).toBeInTheDocument();
    });
  });

/** A IMPLEMENTAR
  it('9. Tradutor de Erros: Deve exibir o erro customizado cru enviado diretamente pelo Backend', async () => {
    api.post.mockRejectedValue({
      response: { data: { error: 'Você já possui uma Async solicitação pendente. Aguarde o TI.' } }
    });
    render(<Login />);
    
    fireEvent.click(screen.getByText('Esqueci minha senha'));
    
    const resetInput = screen.getAllByPlaceholderText('seu.nome@itapecerica.sp.gov.br')[1];
    fireEvent.submit(resetInput.closest('form'));

    await waitFor(() => {
      expect(screen.getByText('Você já possui uma solicitação pendente. Aguarde o TI.')).toBeInTheDocument();
    });
  }); */

  it('10. Tradutor de Erros: Deve exibir o fallback amigável caso a API caia sem resposta estruturada', async () => {
    api.post.mockRejectedValue(new Error('Network Crash'));
    render(<Login />);
    
    fireEvent.click(screen.getByText('Esqueci minha senha'));
    
    const resetInput = screen.getAllByPlaceholderText('seu.nome@itapecerica.sp.gov.br')[1];
    fireEvent.submit(resetInput.closest('form'));

    await waitFor(() => {
      expect(screen.getByText('Erro ao enviar solicitação. Verifique o e-mail.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(screen.queryByText('Recuperação de Acesso')).toBeNull();
  });
});