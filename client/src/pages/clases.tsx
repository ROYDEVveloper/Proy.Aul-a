import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// TODO: remove mock data
const clasesData = [
  { id: "1", codigo: "1201", nombre: "Cálculo I", programa: "Ing. Sistemas", aula: "1001", estudiantes: 32 },
  { id: "2", codigo: "1202", nombre: "Física I", programa: "Ing. Civil", aula: "1002", estudiantes: 28 },
  { id: "3", codigo: "1203", nombre: "Programación I", programa: "Ing. Sistemas", aula: "1002", estudiantes: 30 },
  { id: "4", codigo: "1204", nombre: "Dibujo Técnico", programa: "Arquitectura", aula: "1003", estudiantes: 25 },
  { id: "5", codigo: "1205", nombre: "Estadística", programa: "Ing. Industrial", aula: "1004", estudiantes: 27 },
  { id: "6", codigo: "1206", nombre: "Química I", programa: "Ing. Civil", aula: "1005", estudiantes: 29 },
];

export default function Clases() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-clases-title">
          Clases
        </h1>
        <p className="text-muted-foreground">
          Listado de todas las clases
        </p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Programa</TableHead>
              <TableHead>Aula</TableHead>
              <TableHead>Estudiantes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clasesData.map((clase) => (
              <TableRow key={clase.id} data-testid={`row-clase-${clase.codigo}`}>
                <TableCell className="font-mono font-semibold">{clase.codigo}</TableCell>
                <TableCell className="font-medium">{clase.nombre}</TableCell>
                <TableCell>
                  <Badge>{clase.programa}</Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{clase.aula}</TableCell>
                <TableCell>
                  <Badge variant="outline">{clase.estudiantes}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
