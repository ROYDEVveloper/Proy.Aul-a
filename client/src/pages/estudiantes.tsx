import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// TODO: remove mock data
const estudiantesData = [
  { id: "1", nombre: "Juan Pérez", programa: "Ing. Sistemas", semestre: 1, aula: "1001", clase: "1201" },
  { id: "2", nombre: "María González", programa: "Ing. Sistemas", semestre: 1, aula: "1001", clase: "1201" },
  { id: "3", nombre: "Carlos Rodríguez", programa: "Ing. Civil", semestre: 2, aula: "1002", clase: "1202" },
  { id: "4", nombre: "Ana Martínez", programa: "Arquitectura", semestre: 1, aula: "1003", clase: "1204" },
  { id: "5", nombre: "Luis Sánchez", programa: "Ing. Industrial", semestre: 3, aula: "1004", clase: "1205" },
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
  const [formData, setFormData] = useState({
    nombre: "",
    programa: "",
    semestre: "",
  });
  const { toast } = useToast();

  const filteredEstudiantes = estudiantesData.filter((estudiante) =>
    estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registrar estudiante:", formData);
    toast({
      title: "Estudiante registrado",
      description: `${formData.nombre} ha sido registrado exitosamente`,
    });
    setDialogOpen(false);
    setFormData({ nombre: "", programa: "", semestre: "" });
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
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Programa</TableHead>
              <TableHead>Semestre</TableHead>
              <TableHead>Aula</TableHead>
              <TableHead>Clase</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEstudiantes.map((estudiante) => (
              <TableRow key={estudiante.id} data-testid={`row-estudiante-${estudiante.id}`}>
                <TableCell className="font-medium">{estudiante.nombre}</TableCell>
                <TableCell>
                  <Badge>{estudiante.programa}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Semestre {estudiante.semestre}</Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{estudiante.aula}</TableCell>
                <TableCell className="font-mono text-sm">{estudiante.clase}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
