import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// TODO: remove mock data
const aulasData = [
  {
    id: "1",
    codigo: "1001",
    capacidad: 35,
    clases: [
      {
        id: "c1",
        codigo: "1201",
        nombre: "Cálculo I",
        programa: "Ing. Sistemas",
        estudiantes: [
          { id: "e1", nombre: "Juan Pérez", semestre: 1 },
          { id: "e2", nombre: "María González", semestre: 1 },
          { id: "e3", nombre: "Carlos Rodríguez", semestre: 2 },
        ],
      },
      {
        id: "c2",
        codigo: "1202",
        nombre: "Física I",
        programa: "Ing. Civil",
        estudiantes: [
          { id: "e4", nombre: "Ana Martínez", semestre: 1 },
          { id: "e5", nombre: "Luis Sánchez", semestre: 1 },
        ],
      },
    ],
  },
  {
    id: "2",
    codigo: "1002",
    capacidad: 40,
    clases: [
      {
        id: "c3",
        codigo: "1203",
        nombre: "Programación I",
        programa: "Ing. Sistemas",
        estudiantes: [
          { id: "e6", nombre: "Sandra López", semestre: 1 },
          { id: "e7", nombre: "Pedro Ramírez", semestre: 2 },
          { id: "e8", nombre: "Laura Torres", semestre: 1 },
        ],
      },
    ],
  },
  {
    id: "3",
    codigo: "1003",
    capacidad: 30,
    clases: [
      {
        id: "c4",
        codigo: "1204",
        nombre: "Dibujo Técnico",
        programa: "Arquitectura",
        estudiantes: [
          { id: "e9", nombre: "Diego Morales", semestre: 1 },
          { id: "e10", nombre: "Carmen Ruiz", semestre: 1 },
        ],
      },
    ],
  },
];

export default function Aulas() {
  const [expandedClase, setExpandedClase] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-aulas-title">
          Aulas
        </h1>
        <p className="text-muted-foreground">
          Vista jerárquica: Aulas → Clases → Estudiantes
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {aulasData.map((aula) => (
          <AccordionItem
            key={aula.id}
            value={aula.id}
            className="border rounded-md"
            data-testid={`accordion-aula-${aula.codigo}`}
          >
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-mono text-sm font-semibold">
                  Aula {aula.codigo}
                </span>
                <Badge variant="secondary">
                  Capacidad: {aula.capacidad}
                </Badge>
                <Badge variant="outline">
                  {aula.clases.length} Clase{aula.clases.length !== 1 ? "s" : ""}
                </Badge>
                <Badge variant="outline">
                  {aula.clases.reduce((acc, clase) => acc + clase.estudiantes.length, 0)} Estudiantes
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-4">
                {aula.clases.map((clase) => (
                  <Card key={clase.id}>
                    <CardHeader
                      className="cursor-pointer hover-elevate"
                      onClick={() => setExpandedClase(expandedClase === clase.id ? null : clase.id)}
                      data-testid={`card-clase-${clase.codigo}`}
                    >
                      <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm">Clase {clase.codigo}</span>
                        <span>-</span>
                        <span>{clase.nombre}</span>
                        <Badge>{clase.programa}</Badge>
                      </CardTitle>
                    </CardHeader>
                    {expandedClase === clase.id && (
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Semestre</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {clase.estudiantes.map((estudiante) => (
                              <TableRow key={estudiante.id} data-testid={`row-estudiante-${estudiante.id}`}>
                                <TableCell>{estudiante.nombre}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">Semestre {estudiante.semestre}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
