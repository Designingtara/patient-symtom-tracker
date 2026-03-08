import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { ClipboardPen, LayoutDashboard, Settings, Info } from 'lucide-react';

const navItems = [
  { to: '/log', label: 'Log', icon: ClipboardPen },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/about', label: 'About', icon: Info },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-stretch justify-around">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              end
              className="flex min-h-[56px] min-w-[56px] flex-1 flex-col items-center justify-center gap-1 px-2 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
              activeClassName="text-primary bg-accent/50"
              aria-label={label}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
