import { useState } from "react";
import { Card } from "@/components/ui/card";
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
import { Save } from "lucide-react";
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

export default function Notas() {
  const [selectedClase, setSelectedClase] = useState("1201");
  const [grades, setGrades] = useState<Record<string, GradeData[]>>(initialGrades);
  const { toast } = useToast();

  const currentGrades = grades[selectedClase] || [];

  const calculateFinal = (nota1: number, nota2: number, nota3: number) => {
    return ((nota1 + nota2 + nota3) / 3).toFixed(1);
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
    console.log("Guardando notas:", grades[selectedClase]);
    toast({
      title: "Notas guardadas",
      description: "Las calificaciones han sido actualizadas exitosamente",
    });
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
        <Button onClick={handleSave} data-testid="button-save-grades">
          <Save className="mr-2 h-4 w-4" />
          Guardar Notas
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estudiante</TableHead>
              <TableHead className="text-center">Nota 1</TableHead>
              <TableHead className="text-center">Nota 2</TableHead>
              <TableHead className="text-center">Nota 3</TableHead>
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
                  <TableCell className="text-center">
                    <span className="font-bold text-lg" data-testid={`text-final-${student.id}`}>
                      {calculateFinal(student.nota1, student.nota2, student.nota3)}
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
      </Card>
    </div>
  );
}
