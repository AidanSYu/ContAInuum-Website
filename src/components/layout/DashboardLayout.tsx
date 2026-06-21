import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CreditCard,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const NAV = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/projects', label: 'Projects', icon: FolderKanban, end: false },
  { to: '/app/billing', label: 'Billing', icon: CreditCard, end: false },
  { to: '/app/settings', label: 'Settings', icon: Settings, end: false },
];

/** Authenticated dashboard shell: sidebar nav + content area. */
export function DashboardLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch {
      toast.error('Could not sign out. Please try again.');
    }
  };

  const SidebarBody = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-6">
        <Logo className="text-base" to="/app" />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-white/[0.06] text-text-primary'
                  : 'text-text-secondary hover:bg-white/[0.03] hover:text-text-primary',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <div className="truncate px-3 pb-2 text-xs text-text-secondary/70">{user?.email}</div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/[0.03] hover:text-text-primary"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-void text-text-primary">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-void-lifted/40 lg:block">
        {SidebarBody}
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-void-lifted lg:hidden">
            {SidebarBody}
          </aside>
        </>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-void/80 px-4 backdrop-blur-xl lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6 text-text-primary" />
          </button>
          <div className="lg:hidden">
            <Logo className="text-base" to="/app" />
          </div>
          <Link
            to="/"
            className="ml-auto font-mono-tech text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-text-primary"
          >
            View site ↗
          </Link>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
