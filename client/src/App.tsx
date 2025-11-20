import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppSidebar } from "@/components/app-sidebar";
import { Footer } from "@/components/footer";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Estudiantes from "@/pages/estudiantes";
import Aulas from "@/pages/aulas";
import Clases from "@/pages/clases";
import Programas from "@/pages/programas";
import Notas from "@/pages/notas";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/estudiantes" component={Estudiantes} />
      <Route path="/aulas" component={Aulas} />
      <Route path="/clases" component={Clases} />
      <Route path="/programas" component={Programas} />
      <Route path="/notas" component={Notas} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-4 border-b">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-auto p-6">
                  <div className="max-w-7xl mx-auto">
                    <Router />
                  </div>
                </main>
                <Footer />
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
