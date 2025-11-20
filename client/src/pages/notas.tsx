import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Settings } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// TODO: remove mock data
const clasesData = [
  { id: "1201", nombre: "Cálculo I", codigo: "1201" },
  { id: "1202", nombre: "Física I", codigo: "1202" },
  { id: "1203", nombre: "Programación I", codigo: "1203" },
  { id: "1204", nombre: "Dibujo Técnico", codigo: "1204" },
];

// TODO: remove mock data
const initialGrades = {
  "1201": [
    { id: "1", nombre: "Juan Pérez", nota1: 4.0, nota2: 4.2, nota3: 4.5 },
    { id: "2", nombre: "María González", nota1: 4.5, nota2: 4.3, nota3: 4.8 },
    { id: "3", nombre: "Carlos Rodríguez", nota1: 3.5, nota2: 3.8, nota3: 4.0 },
  ],
  "1202": [
    { id: "4", nombre: "Ana Martínez", nota1: 4.2, nota2: 4.0, nota3: 4.3 },
    { id: "5", nombre: "Luis Sánchez", nota1: 3.8, nota2: 4.1, nota3: 3.9 },
  ],
  "1203": [
    { id: "6", nombre: "Sandra López", nota1: 4.6, nota2: 4.5, nota3: 4.7 },
    { id: "7", nombre: "Pedro Ramírez", nota1: 3.2, nota2: 3.5, nota3: 3.4 },
  ],
  "1204": [
    { id: "9", nombre: "Diego Morales", nota1: 4.1, nota2: 4.3, nota3: 4.0 },
  ],
};

type GradeData = {
  id: string;
  nombre: string;
  nota1: number;
  nota2: number;
  nota3: number;
};

type CutConfig = {
  nombre: string;
  porcentaje: number;
};

export default function Notas() {
  const [selectedClase, setSelectedClase] = useState("1201");
  const [grades, setGrades] = useState<Record<string, GradeData[]>>(initialGrades);
  const [configOpen, setConfigOpen] = useState(false);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [numCortes, setNumCortes] = useState(3);
  const [cortes, setCortes] = useState<CutConfig[]>([
    { nombre: "Corte 1", porcentaje: 30 },
    { nombre: "Corte 2", porcentaje: 30 },
    { nombre: "Corte 3", porcentaje: 40 },
  ]);
  const { toast } = useToast();

  const currentGrades = grades[selectedClase] || [];

  const calculateFinal = (nota1: number, nota2: number, nota3: number) => {
    if (numCortes === 2) {
      return ((nota1 * cortes[0].porcentaje / 100) + (nota2 * cortes[1].porcentaje / 100)).toFixed(1);
    }
    return ((nota1 * cortes[0].porcentaje / 100) + (nota2 * cortes[1].porcentaje / 100) + (nota3 * cortes[2].porcentaje / 100)).toFixed(1);
  };

  const handleGradeChange = (studentId: string, field: "nota1" | "nota2" | "nota3", value: string) => {
    const numValue = parseFloat(value);
    if (numValue >= 0 && numValue <= 5) {
      setGrades((prev) => ({
        ...prev,
        [selectedClase]: prev[selectedClase].map((student) =>
          student.id === studentId
            ? { ...student, [field]: numValue }
            : student
        ),
      }));
    }
  };

  const handleSave = () => {
    setSaveConfirmOpen(true);
  };

  const confirmSave = () => {
    console.log("Guardando notas:", grades[selectedClase]);
    toast({
      title: "Notas guardadas",
      description: "Las calificaciones han sido actualizadas exitosamente",
    });
    setSaveConfirmOpen(false);
  };

  const handleNumCortesChange = (value: string) => {
    const num = parseInt(value);
    setNumCortes(num);
    if (num === 2) {
      setCortes([
        { nombre: "Corte 1", porcentaje: 50 },
        { nombre: "Corte 2", porcentaje: 50 },
      ]);
    } else if (num === 3) {
      setCortes([
        { nombre: "Corte 1", porcentaje: 30 },
        { nombre: "Corte 2", porcentaje: 30 },
        { nombre: "Corte 3", porcentaje: 40 },
      ]);
    } else if (num === 4) {
      setCortes([
        { nombre: "Corte 1", porcentaje: 25 },
        { nombre: "Corte 2", porcentaje: 25 },
        { nombre: "Corte 3", porcentaje: 25 },
        { nombre: "Corte 4", porcentaje: 25 },
      ]);
    }
  };

  const updateCortePorcentaje = (index: number, value: string) => {
    const numValue = parseFloat(value);
    if (numValue >= 0 && numValue <= 100) {
      const newCortes = [...cortes];
      newCortes[index].porcentaje = numValue;
      setCortes(newCortes);
    }
  };

  const totalPorcentaje = cortes.reduce((sum, corte) => sum + corte.porcentaje, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-notas-title">
          Notas
        </h1>
        <p className="text-muted-foreground">
          Ingresa y gestiona calificaciones
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={selectedClase} onValueChange={setSelectedClase}>
            <SelectTrigger className="w-64" data-testid="select-clase">
              <SelectValue placeholder="Selecciona una clase" />
            </SelectTrigger>
            <SelectContent>
              {clasesData.map((clase) => (
                <SelectItem key={clase.id} value={clase.id}>
                  {clase.codigo} - {clase.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={configOpen} onOpenChange={setConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="button-config-cortes">
                <Settings className="mr-2 h-4 w-4" />
                Configurar Cortes
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configuración de Cortes</DialogTitle>
                <DialogDescription>
                  Define la cantidad de cortes y el porcentaje de cada uno
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Número de Cortes</Label>
                  <Select value={numCortes.toString()} onValueChange={handleNumCortesChange}>
                    <SelectTrigger data-testid="select-num-cortes">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Cortes</SelectItem>
                      <SelectItem value="3">3 Cortes</SelectItem>
                      <SelectItem value="4">4 Cortes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Porcentajes</Label>
                  {cortes.map((corte, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Label className="w-24">{corte.nombre}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={corte.porcentaje}
                        onChange={(e) => updateCortePorcentaje(index, e.target.value)}
                        className="w-24"
                        data-testid={`input-porcentaje-${index}`}
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Total:</span>
                    <Badge variant={totalPorcentaje === 100 ? "default" : "destructive"}>
                      {totalPorcentaje}%
                    </Badge>
                  </div>
                  {totalPorcentaje !== 100 && (
                    <p className="text-sm text-destructive">
                      La suma de los porcentajes debe ser 100%
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => setConfigOpen(false)}
                  className="w-full"
                  disabled={totalPorcentaje !== 100}
                  data-testid="button-save-config"
                >
                  Guardar Configuración
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Button onClick={handleSave} data-testid="button-save-grades">
          <Save className="mr-2 h-4 w-4" />
          Guardar Notas
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Calificaciones</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {cortes.map((corte, index) => (
                <Badge key={index} variant="outline">
                  {corte.nombre}: {corte.porcentaje}%
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                {cortes.map((corte, index) => (
                  <TableHead key={index} className="text-center">{corte.nombre}</TableHead>
                ))}
                <TableHead className="text-center">Final</TableHead>
                <TableHead className="text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentGrades.map((student) => {
                const finalGrade = parseFloat(calculateFinal(student.nota1, student.nota2, student.nota3));
                return (
                  <TableRow key={student.id} data-testid={`row-grade-${student.id}`}>
                    <TableCell className="font-medium">{student.nombre}</TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={student.nota1}
                        onChange={(e) => handleGradeChange(student.id, "nota1", e.target.value)}
                        className="w-20 mx-auto text-center"
                        data-testid={`input-nota1-${student.id}`}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={student.nota2}
                        onChange={(e) => handleGradeChange(student.id, "nota2", e.target.value)}
                        className="w-20 mx-auto text-center"
                        data-testid={`input-nota2-${student.id}`}
                      />
                    </TableCell>
                    {numCortes >= 3 && (
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={student.nota3}
                          onChange={(e) => handleGradeChange(student.id, "nota3", e.target.value)}
                          className="w-20 mx-auto text-center"
                          data-testid={`input-nota3-${student.id}`}
                        />
                      </TableCell>
                    )}
                    {numCortes === 4 && (
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={0}
                          className="w-20 mx-auto text-center"
                        />
                      </TableCell>
                    )}
                    <TableCell className="text-center">
                      <span className="font-bold text-lg" data-testid={`text-final-${student.id}`}>
                        {finalGrade.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={finalGrade >= 3.0 ? "default" : "destructive"}
                        data-testid={`badge-status-${student.id}`}
                      >
                        {finalGrade >= 3.0 ? "Aprobado" : "Reprobado"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={saveConfirmOpen} onOpenChange={setSaveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Actualizar las notas?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de actualizar las notas de todos los estudiantes de esta clase?
              Esta acción guardará los cambios realizados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-save">No, cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave} data-testid="button-confirm-save">
              Sí, actualizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
