import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import LogView from "./pages/LogView";
import DashboardView from "./pages/DashboardView";
import SettingsView from "./pages/SettingsView";
import AboutView from "./pages/AboutView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/log" replace />} />
            <Route path="/log" element={<LogView />} />
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
