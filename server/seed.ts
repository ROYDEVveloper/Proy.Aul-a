import { storage } from "./storage";

async function seed() {
  console.log("Seeding database...");

  // Crear programas
  const programasData = [
    "Ing. Sistemas",
    "Ing. Civil",
    "Ing. Industrial",
    "Arquitectura",
    "Diseño Gráfico",
  ];

  const programas = [];
  for (const nombre of programasData) {
    try {
      const programa = await storage.createPrograma({ nombre });
      programas.push(programa);
      console.log(`Created programa: ${nombre}`);
    } catch (error) {
      console.log(`Programa ${nombre} already exists`);
      const allProgramas = await storage.getProgramas();
      const existing = allProgramas.find(p => p.nombre === nombre);
      if (existing) programas.push(existing);
    }
  }

  // Crear aulas
  const aulasData = [
    { codigo: "1001", capacidad: 35 },
    { codigo: "1002", capacidad: 40 },
    { codigo: "1003", capacidad: 30 },
    { codigo: "1004", capacidad: 38 },
    { codigo: "1005", capacidad: 32 },
  ];

  const aulas = [];
  for (const aulaData of aulasData) {
    try {
      const aula = await storage.createAula(aulaData);
      aulas.push(aula);
      console.log(`Created aula: ${aulaData.codigo}`);
    } catch (error) {
      console.log(`Aula ${aulaData.codigo} already exists`);
      const allAulas = await storage.getAulas();
      const existing = allAulas.find(a => a.codigo === aulaData.codigo);
      if (existing) aulas.push(existing);
    }
  }

  // Crear clases
  const clasesData = [
    { codigo: "1201", nombre: "Cálculo I", programaId: programas[0].id, aulaId: aulas[0].id },
    { codigo: "1202", nombre: "Física I", programaId: programas[1].id, aulaId: aulas[1].id },
    { codigo: "1203", nombre: "Programación I", programaId: programas[0].id, aulaId: aulas[1].id },
    { codigo: "1204", nombre: "Dibujo Técnico", programaId: programas[3].id, aulaId: aulas[2].id },
    { codigo: "1205", nombre: "Estadística", programaId: programas[2].id, aulaId: aulas[3].id },
    { codigo: "1206", nombre: "Química I", programaId: programas[1].id, aulaId: aulas[4].id },
  ];

  const clases = [];
  for (const claseData of clasesData) {
    try {
      const clase = await storage.createClase(claseData);
      clases.push(clase);
      console.log(`Created clase: ${claseData.codigo}`);
    } catch (error) {
      console.log(`Clase ${claseData.codigo} already exists`);
      const allClases = await storage.getClases();
      const existing = allClases.find(c => c.codigo === claseData.codigo);
      if (existing) clases.push(existing);
    }
  }

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
