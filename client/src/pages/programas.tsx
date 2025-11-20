import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// TODO: remove mock data
const programasData = {
  "Ing. Sistemas": [
    { id: "1", nombre: "Juan Pérez", semestre: 1, aula: "1001", promedio: 4.2 },
    { id: "2", nombre: "María González", semestre: 1, aula: "1001", promedio: 4.5 },
    { id: "3", nombre: "Sandra López", semestre: 2, aula: "1002", promedio: 3.8 },
  ],
  "Ing. Civil": [
    { id: "4", nombre: "Carlos Rodríguez", semestre: 2, aula: "1002", promedio: 4.0 },
    { id: "5", nombre: "Ana Martínez", semestre: 1, aula: "1001", promedio: 4.3 },
  ],
  "Ing. Industrial": [
    { id: "6", nombre: "Luis Sánchez", semestre: 3, aula: "1004", promedio: 3.9 },
  ],
  "Arquitectura": [
    { id: "7", nombre: "Diego Morales", semestre: 1, aula: "1003", promedio: 4.1 },
    { id: "8", nombre: "Carmen Ruiz", semestre: 1, aula: "1003", promedio: 4.4 },
  ],
  "Diseño Gráfico": [
    { id: "9", nombre: "Laura Torres", semestre: 2, aula: "1002", promedio: 4.6 },
  ],
};

export default function Programas() {
  const [selectedProgram, setSelectedProgram] = useState("Ing. Sistemas");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  const currentStudents = programasData[selectedProgram as keyof typeof programasData] || [];
  
  const filteredStudents = selectedSemester === "all"
    ? currentStudents
    : currentStudents.filter((s) => s.semestre.toString() === selectedSemester);

  const availableSemesters = Array.from(
    new Set(currentStudents.map((s) => s.semestre))
  ).sort();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-programas-title">
          Programas
        </h1>
        <p className="text-muted-foreground">
          Vista por programa y semestre
        </p>
      </div>

      <Tabs value={selectedProgram} onValueChange={setSelectedProgram}>
        <TabsList className="flex-wrap h-auto gap-2">
          {Object.keys(programasData).map((programa) => (
            <TabsTrigger
              key={programa}
              value={programa}
              data-testid={`tab-${programa.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {programa}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(programasData).map((programa) => (
          <TabsContent key={programa} value={programa} className="space-y-4">
            <div className="flex items-center gap-4">
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-48" data-testid="select-filter-semester">
                  <SelectValue placeholder="Filtrar por semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los semestres</SelectItem>
                  {availableSemesters.map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semestre {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline">
                {filteredStudents.length} estudiante{filteredStudents.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Aula</TableHead>
                    <TableHead>Promedio</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((estudiante) => (
                    <TableRow key={estudiante.id} data-testid={`row-student-${estudiante.id}`}>
                      <TableCell className="font-medium">{estudiante.nombre}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Semestre {estudiante.semestre}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{estudiante.aula}</TableCell>
                      <TableCell className="font-semibold">{estudiante.promedio.toFixed(1)}</TableCell>
                      <TableCell>
                        <Badge variant={estudiante.promedio >= 3.0 ? "default" : "destructive"}>
                          {estudiante.promedio >= 3.0 ? "Aprobado" : "Reprobado"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
