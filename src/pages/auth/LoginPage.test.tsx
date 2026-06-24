import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Shared spies (hoisted so the hoisted vi.mock factories can reference them).
const { signInWithPassword, navigate, toastError } = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  navigate: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ useAuth: () => ({ signInWithPassword }) }));
vi.mock('sonner', () => ({ toast: { error: toastError, success: vi.fn() } }));
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigate };
});

import { LoginPage } from './LoginPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  signInWithPassword.mockReset();
  navigate.mockReset();
  toastError.mockReset();
});

describe('LoginPage', () => {
  it('renders the heading and the email + password fields', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows validation errors and does not sign in on an empty submit', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it('signs in and navigates to /app with valid credentials', async () => {
    signInWithPassword.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(signInWithPassword).toHaveBeenCalledWith('user@example.com', 'secret123'));
    expect(navigate).toHaveBeenCalledWith('/app', { replace: true });
    expect(toastError).not.toHaveBeenCalled();
  });

  it('shows a toast and does not navigate when sign-in fails', async () => {
    signInWithPassword.mockRejectedValue(new Error('Invalid login credentials'));
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(toastError).toHaveBeenCalledWith('Invalid login credentials'));
    expect(navigate).not.toHaveBeenCalled();
  });
});
