import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DoorOpen, BookOpen, GraduationCap, Plus, FileEdit } from "lucide-react";
import { Link } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// TODO: remove mock data
const gradeDistribution = [
  { range: "0-1", count: 8 },
  { range: "1-2", count: 15 },
  { range: "2-3", count: 45 },
  { range: "3-4", count: 120 },
  { range: "4-5", count: 154 },
];

// TODO: remove mock data
const recentActivity = [
  { action: "Estudiante registrado", detail: "María González - Ing. Sistemas", time: "Hace 5 min" },
  { action: "Notas actualizadas", detail: "Clase 1201 - Cálculo I", time: "Hace 1 hora" },
  { action: "Nueva aula creada", detail: "Aula 1015 - Capacidad 35", time: "Hace 3 horas" },
];

export default function Dashboard() {
  const { data: estudiantes = [] } = useQuery({ queryKey: ["/api/estudiantes"] });
  const { data: aulas = [] } = useQuery({ queryKey: ["/api/aulas"] });
  const { data: clases = [] } = useQuery({ queryKey: ["/api/clases"] });
  const { data: programas = [] } = useQuery({ queryKey: ["/api/programas"] });

  const programEnrollment = (programas as any[]).map((programa: any, index: number) => {
    const count = (estudiantes as any[]).filter((e: any) => e.programaId === programa.id).length;
    const colors = [
      "#FF6B6B",
      "#4ECDC4", 
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
    ];
    return {
      name: programa.nombre,
      value: count,
      color: colors[index % colors.length],
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Vista general del sistema académico
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Estudiantes"
          value={(estudiantes as any[]).length}
          icon={Users}
          testId="text-total-students"
        />
        <StatCard
          title="Total Aulas"
          value={(aulas as any[]).length}
          icon={DoorOpen}
          testId="text-total-aulas"
        />
        <StatCard
          title="Total Clases"
          value={(clases as any[]).length}
          icon={BookOpen}
          testId="text-total-clases"
        />
        <StatCard
          title="Programas"
          value={(programas as any[]).length}
          icon={GraduationCap}
          testId="text-total-programs"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Notas</CardTitle>
            <CardDescription>Calificaciones de todos los estudiantes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="range" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="count" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Matrícula por Programa</CardTitle>
            <CardDescription>Distribución de estudiantes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={programEnrollment}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {programEnrollment.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas frecuentes</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild className="justify-start" data-testid="button-register-student">
              <Link href="/estudiantes">
                <Plus className="mr-2 h-4 w-4" />
                Registrar Estudiante
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start" data-testid="button-enter-grades">
              <Link href="/notas">
                <FileEdit className="mr-2 h-4 w-4" />
                Ingresar Notas
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.detail}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
