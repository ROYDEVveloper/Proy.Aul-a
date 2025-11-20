import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { queryClient, apiRequest } from "@/lib/queryClient";

type CutConfig = {
  nombre: string;
  porcentaje: number;
};

type StudentGrade = {
  estudianteId: string;
  nombre: string;
  nota1: number;
  nota2: number;
  nota3: number;
  nota4: number;
  notaId?: string;
};

export default function Notas() {
  const [selectedClase, setSelectedClase] = useState("");
  const [configOpen, setConfigOpen] = useState(false);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [numCortes, setNumCortes] = useState(3);
  const [cortes, setCortes] = useState<CutConfig[]>([
    { nombre: "Corte 1", porcentaje: 30 },
    { nombre: "Corte 2", porcentaje: 30 },
    { nombre: "Corte 3", porcentaje: 40 },
  ]);
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([]);
  const { toast } = useToast();

  const { data: clases = [] } = useQuery({
    queryKey: ["/api/clases"],
  });

  const { data: estudiantes = [] } = useQuery({
    queryKey: ["/api/estudiantes"],
  });

  const { data: notas = [] } = useQuery({
    queryKey: ["/api/notas"],
  });

  // Auto-select first class
  useEffect(() => {
    if ((clases as any[]).length > 0 && !selectedClase) {
      setSelectedClase((clases as any[])[0].id);
    }
  }, [clases, selectedClase]);

  // Update student grades when class or data changes
  useEffect(() => {
    if (!selectedClase) return;

    const estudiantesDeClase = (estudiantes as any[]).filter(
      (e: any) => e.claseId === selectedClase
    );

    const grades: StudentGrade[] = estudiantesDeClase.map((estudiante: any) => {
      const nota = (notas as any[]).find(
        (n: any) => n.estudianteId === estudiante.id && n.claseId === selectedClase
      );

      return {
        estudianteId: estudiante.id,
        nombre: estudiante.nombre,
        nota1: nota ? parseFloat(nota.nota1) : 0,
        nota2: nota ? parseFloat(nota.nota2) : 0,
        nota3: nota ? parseFloat(nota.nota3) : 0,
        nota4: nota ? parseFloat(nota.nota4) : 0,
        notaId: nota?.id,
      };
    });

    setStudentGrades(grades);
  }, [selectedClase, estudiantes, notas]);

  const updateNotaMutation = useMutation({
    mutationFn: async ({ notaId, data }: { notaId?: string; data: any }) => {
      if (notaId) {
        const res = await apiRequest("PATCH", `/api/notas/${notaId}`, data);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/notas", data);
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notas"] });
    },
  });

  const calculateFinal = (nota1: number, nota2: number, nota3: number, nota4: number) => {
    if (numCortes === 2) {
      return ((nota1 * cortes[0].porcentaje / 100) + (nota2 * cortes[1].porcentaje / 100)).toFixed(1);
    } else if (numCortes === 3) {
      return ((nota1 * cortes[0].porcentaje / 100) + (nota2 * cortes[1].porcentaje / 100) + (nota3 * cortes[2].porcentaje / 100)).toFixed(1);
    } else {
      return ((nota1 * cortes[0].porcentaje / 100) + (nota2 * cortes[1].porcentaje / 100) + (nota3 * cortes[2].porcentaje / 100) + (nota4 * cortes[3].porcentaje / 100)).toFixed(1);
    }
  };

  const handleGradeChange = (estudianteId: string, field: "nota1" | "nota2" | "nota3" | "nota4", value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue >= 0 && numValue <= 5) {
      setStudentGrades((prev) =>
        prev.map((student) =>
          student.estudianteId === estudianteId
            ? { ...student, [field]: numValue }
            : student
        )
      );
    }
  };

  const handleSave = () => {
    setSaveConfirmOpen(true);
  };

  const confirmSave = async () => {
    for (const student of studentGrades) {
      const notaData = {
        estudianteId: student.estudianteId,
        claseId: selectedClase,
        nota1: student.nota1.toString(),
        nota2: student.nota2.toString(),
        nota3: student.nota3.toString(),
        nota4: student.nota4.toString(),
      };

      await updateNotaMutation.mutateAsync({
        notaId: student.notaId,
        data: notaData,
      });
    }

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

  const getClaseNombre = (claseId: string) => {
    const clase = (clases as any[]).find((c: any) => c.id === claseId);
    return clase ? `${clase.codigo} - ${clase.nombre}` : "";
  };

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
              {(clases as any[]).map((clase: any) => (
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
        <Button
          onClick={handleSave}
          disabled={updateNotaMutation.isPending || studentGrades.length === 0}
          data-testid="button-save-grades"
        >
          <Save className="mr-2 h-4 w-4" />
          {updateNotaMutation.isPending ? "Guardando..." : "Guardar Notas"}
        </Button>
      </div>

      {studentGrades.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                {selectedClase
                  ? "No hay estudiantes registrados en esta clase"
                  : "Selecciona una clase para ver los estudiantes"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle>Calificaciones</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
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
                    <TableHead key={index} className="text-center">
                      {corte.nombre}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Final</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentGrades.map((student) => {
                  const finalGrade = parseFloat(
                    calculateFinal(student.nota1, student.nota2, student.nota3, student.nota4)
                  );
                  return (
                    <TableRow key={student.estudianteId} data-testid={`row-grade-${student.estudianteId}`}>
                      <TableCell className="font-medium">{student.nombre}</TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={student.nota1}
                          onChange={(e) =>
                            handleGradeChange(student.estudianteId, "nota1", e.target.value)
                          }
                          className="w-20 mx-auto text-center"
                          data-testid={`input-nota1-${student.estudianteId}`}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={student.nota2}
                          onChange={(e) =>
                            handleGradeChange(student.estudianteId, "nota2", e.target.value)
                          }
                          className="w-20 mx-auto text-center"
                          data-testid={`input-nota2-${student.estudianteId}`}
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
                            onChange={(e) =>
                              handleGradeChange(student.estudianteId, "nota3", e.target.value)
                            }
                            className="w-20 mx-auto text-center"
                            data-testid={`input-nota3-${student.estudianteId}`}
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
                            value={student.nota4}
                            onChange={(e) =>
                              handleGradeChange(student.estudianteId, "nota4", e.target.value)
                            }
                            className="w-20 mx-auto text-center"
                            data-testid={`input-nota4-${student.estudianteId}`}
                          />
                        </TableCell>
                      )}
                      <TableCell className="text-center">
                        <span className="font-bold text-lg" data-testid={`text-final-${student.estudianteId}`}>
                          {finalGrade.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={finalGrade >= 3.0 ? "default" : "destructive"}
                          data-testid={`badge-status-${student.estudianteId}`}
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
      )}

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
