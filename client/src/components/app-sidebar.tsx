import {
  LayoutDashboard,
  Users,
  DoorOpen,
  BookOpen,
  GraduationCap,
  FileText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Estudiantes",
    url: "/estudiantes",
    icon: Users,
  },
  {
    title: "Aulas",
    url: "/aulas",
    icon: DoorOpen,
  },
  {
    title: "Clases",
    url: "/clases",
    icon: BookOpen,
  },
  {
    title: "Programas",
    url: "/programas",
    icon: GraduationCap,
  },
  {
    title: "Notas",
    url: "/notas",
    icon: FileText,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-2 px-2 py-2 mb-2">
            <img src="/logo.png" alt="EasyWork Logo" className="w-10 h-10 rounded-md" />
            <span className="font-semibold text-sm">EasyWork</span>
          </div>
          <SidebarGroupLabel>Gestión Académica</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase()}`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
