import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

// TODO: remove mock data
const initialEstudiantesData = [
  { id: "1", nombre: "Juan Pérez", programa: "Ing. Sistemas", semestre: 1, aula: "1001", clase: "1201" },
  { id: "2", nombre: "María González", programa: "Ing. Sistemas", semestre: 1, aula: "1001", clase: "1201" },
  { id: "3", nombre: "Carlos Rodríguez", programa: "Ing. Civil", semestre: 2, aula: "1002", clase: "1202" },
  { id: "4", nombre: "Ana Martínez", programa: "Arquitectura", semestre: 1, aula: "1003", clase: "1204" },
  { id: "5", nombre: "Luis Sánchez", programa: "Ing. Industrial", semestre: 3, aula: "1004", clase: "1205" },
  { id: "6", nombre: "Sandra López", programa: "Ing. Sistemas", semestre: 2, aula: "1002", clase: "1203" },
  { id: "7", nombre: "Pedro Ramírez", programa: "Ing. Civil", semestre: 1, aula: "1001", clase: "1202" },
  { id: "8", nombre: "Laura Torres", programa: "Diseño Gráfico", semestre: 2, aula: "1002", clase: "1206" },
];

// TODO: remove mock data
const programas = [
  "Ing. Sistemas",
  "Ing. Civil",
  "Ing. Industrial",
  "Arquitectura",
  "Diseño Gráfico",
];

export default function Estudiantes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [estudiantes, setEstudiantes] = useState(initialEstudiantesData);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    programa: "",
    semestre: "",
  });
  const { toast } = useToast();

  const filteredEstudiantes = estudiantes.filter((estudiante) =>
    estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEstudiante = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      programa: formData.programa,
      semestre: parseInt(formData.semestre),
      aula: "1001",
      clase: "1201",
    };
    setEstudiantes([...estudiantes, newEstudiante]);
    console.log("Registrar estudiante:", formData);
    toast({
      title: "Estudiante registrado",
      description: `${formData.nombre} ha sido registrado exitosamente`,
    });
    setDialogOpen(false);
    setFormData({ nombre: "", programa: "", semestre: "" });
  };

  const handleDelete = () => {
    if (deleteId) {
      setEstudiantes(estudiantes.filter((e) => e.id !== deleteId));
      toast({
        title: "Estudiante eliminado",
        description: "El estudiante ha sido eliminado del sistema",
      });
      setDeleteId(null);
    }
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
                  value={formData.programa}
                  onValueChange={(value) => setFormData({ ...formData, programa: value })}
                  required
                >
                  <SelectTrigger id="programa" data-testid="select-program">
                    <SelectValue placeholder="Selecciona un programa" />
                  </SelectTrigger>
                  <SelectContent>
                    {programas.map((programa) => (
                      <SelectItem key={programa} value={programa}>
                        {programa}
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
              {formData.programa && formData.semestre && (
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-sm">Asignación Automática</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Aula:</span>
                      <span className="font-mono font-semibold">1001</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Clase:</span>
                      <span className="font-mono font-semibold">1201</span>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Button type="submit" className="w-full" data-testid="button-submit-student">
                Registrar Estudiante
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
        {filteredEstudiantes.map((estudiante) => (
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
                <Badge>{estudiante.programa}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Semestre</span>
                <Badge variant="outline">Semestre {estudiante.semestre}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Aula</span>
                <span className="font-mono text-sm font-semibold">{estudiante.aula}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Clase</span>
                <span className="font-mono text-sm font-semibold">{estudiante.clase}</span>
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
