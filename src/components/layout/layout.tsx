import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import Header from "./Header";
import { AppSidebar } from "@/components/layout/AppSidebar";
import UserContextSidebar from "@/components/layout/UserContextSidebar";
import { Toaster } from "../ui/sonner";
import { useLocation } from "react-router";
import { useEffect, useRef } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: LayoutProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null)
  const anoAtual = new Date().getFullYear();
  const userContextMatch = location.pathname.match(/^\/gestao-de-utilizadores\/([^/]+)/)
  const isUserContext = Boolean(userContextMatch)
  const userId = userContextMatch?.[1] ?? ""

  useEffect(() => {
    mainRef.current?.scrollTo({
      top: 0,
      behavior: "instant",
    })
  }, [location.pathname])
  return (
    <div className="flex h-svh w-full overflow-hidden bg-[#F6F5FA]">
      {/* Sidebar */}
      <aside
        className={`relative z-30 h-svh w-0 shrink-0 overflow-visible transition-[width] duration-300 ${state === "expanded" ? "lg:w-[var(--sidebar-width)]" : "lg:w-[var(--sidebar-width-icon)]"}`}
      >
        {isUserContext ? <UserContextSidebar userId={userId} /> : <AppSidebar />}
      </aside>

      {/* Conteúdo principal */}
      <main ref={mainRef} className="relative h-svh min-w-0 flex-1 overflow-y-auto bg-[#F6F5FA]">
        <div className="sticky right-0 top-0 z-20 w-full">
          <Header />
        </div>

        <div className="p-4 lg:p-8">
          {children}
        </div>
        <p className="px-4 pb-4 text-sm text-[#4B5563] lg:px-8">
          © {anoAtual} Sómoney, Todos os direitos reservados.
        </p>

        <Toaster />
      </main>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
