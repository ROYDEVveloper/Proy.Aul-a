import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function Estudiantes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    programaId: "",
    semestre: "",
  });
  const { toast } = useToast();

  const { data: estudiantes = [] } = useQuery({
    queryKey: ["/api/estudiantes"],
  });

  const { data: programas = [] } = useQuery({
    queryKey: ["/api/programas"],
  });

  const { data: aulas = [] } = useQuery({
    queryKey: ["/api/aulas"],
  });

  const { data: clases = [] } = useQuery({
    queryKey: ["/api/clases"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/estudiantes", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/estudiantes"] });
      toast({
        title: "Estudiante registrado",
        description: `${formData.nombre} ha sido registrado exitosamente`,
      });
      setDialogOpen(false);
      setFormData({ nombre: "", programaId: "", semestre: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/estudiantes/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/estudiantes"] });
      toast({
        title: "Estudiante eliminado",
        description: "El estudiante ha sido eliminado del sistema",
      });
      setDeleteId(null);
    },
  });

  const filteredEstudiantes = (estudiantes as any[]).filter((estudiante: any) =>
    estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const aulaId = (aulas as any[])[0]?.id || "";
    const claseId = (clases as any[])[0]?.id || "";
    
    createMutation.mutate({
      nombre: formData.nombre,
      programaId: formData.programaId,
      semestre: parseInt(formData.semestre),
      aulaId,
      claseId,
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const getProgramaNombre = (programaId: string) => {
    const programa = (programas as any[]).find((p: any) => p.id === programaId);
    return programa?.nombre || "";
  };

  const getAulaCodigo = (aulaId: string) => {
    const aula = (aulas as any[]).find((a: any) => a.id === aulaId);
    return aula?.codigo || "";
  };

  const getClaseCodigo = (claseId: string) => {
    const clase = (clases as any[]).find((c: any) => c.id === claseId);
    return clase?.codigo || "";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-estudiantes-title">
            Estudiantes
          </h1>
          <p className="text-muted-foreground">
            Gestiona y registra estudiantes
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-student">
              <Plus className="mr-2 h-4 w-4" />
              Registrar Estudiante
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Estudiante</DialogTitle>
              <DialogDescription>
                Completa los datos del estudiante. La asignación de aula y clase será automática.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  data-testid="input-student-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="programa">Programa</Label>
                <Select
                  value={formData.programaId}
                  onValueChange={(value) => setFormData({ ...formData, programaId: value })}
                  required
                >
                  <SelectTrigger id="programa" data-testid="select-program">
                    <SelectValue placeholder="Selecciona un programa" />
                  </SelectTrigger>
                  <SelectContent>
                    {(programas as any[]).map((programa: any) => (
                      <SelectItem key={programa.id} value={programa.id}>
                        {programa.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semestre">Semestre</Label>
                <Select
                  value={formData.semestre}
                  onValueChange={(value) => setFormData({ ...formData, semestre: value })}
                  required
                >
                  <SelectTrigger id="semestre" data-testid="select-semester">
                    <SelectValue placeholder="Selecciona semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semestre {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.programaId && formData.semestre && (aulas as any[])[0] && (clases as any[])[0] && (
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-sm">Asignación Automática</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Aula:</span>
                      <span className="font-mono font-semibold">{(aulas as any[])[0].codigo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Clase:</span>
                      <span className="font-mono font-semibold">{(clases as any[])[0].codigo}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending}
                data-testid="button-submit-student"
              >
                {createMutation.isPending ? "Registrando..." : "Registrar Estudiante"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar estudiante..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-student"
          />
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredEstudiantes.length} estudiante{filteredEstudiantes.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEstudiantes.map((estudiante: any) => (
          <Card key={estudiante.id} className="hover-elevate" data-testid={`card-estudiante-${estudiante.id}`}>
            <CardHeader>
              <CardTitle className="flex items-start justify-between gap-2">
                <span className="text-lg">{estudiante.nombre}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteId(estudiante.id)}
                  data-testid={`button-delete-${estudiante.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Programa</span>
                <Badge>{getProgramaNombre(estudiante.programaId)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Semestre</span>
                <Badge variant="outline">Semestre {estudiante.semestre}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Aula</span>
                <span className="font-mono text-sm font-semibold">{getAulaCodigo(estudiante.aulaId)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Clase</span>
                <span className="font-mono text-sm font-semibold">{getClaseCodigo(estudiante.claseId)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar estudiante?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El estudiante será eliminado permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
