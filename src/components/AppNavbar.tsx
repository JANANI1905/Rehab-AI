import { useState } from 'react';
import { NavLink } from '@/components/NavLink';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Home, Plus, History, FileText, User, LogOut, Bot, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'New Session', url: '/new-session', icon: Plus },
  { title: 'History', url: '/history', icon: History },
  { title: 'Reports', url: '/reports', icon: FileText },
  { title: 'Profile', url: '/profile', icon: User },
];

export function AppNavbar({ initials, displayName }: { initials: string; displayName: string }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-extrabold text-lg text-foreground tracking-tight">RehabAI</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                activeClassName="bg-primary/5 text-primary border border-primary/10 shadow-sm"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>

          {/* User Info & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 border-r pr-4">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-inner">
                {initials}
              </div>
              <span className="text-xs font-bold text-muted-foreground max-w-[120px] truncate">
                {displayName}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl px-3"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              {initials}
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/50"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="md:hidden border-b bg-background px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              activeClassName="bg-primary/5 text-primary border border-primary/10"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
          <div className="border-t pt-4 mt-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl px-4 py-3"
              onClick={() => {
                setMobileOpen(false);
                handleSignOut();
              }}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
