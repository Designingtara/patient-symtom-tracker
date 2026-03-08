import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { BottomNav } from '@/components/BottomNav';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 border-b bg-card px-4 py-3">
          <h1 className="text-xl font-bold">Ebbi</h1>
        </header>
        <main className="px-4 py-4" role="main">
          {children}
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-card">
            <SidebarTrigger className="ml-2" />
          </header>
          <main className="flex-1 p-6" role="main">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
