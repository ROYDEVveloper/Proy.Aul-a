import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEstudianteSchema, insertNotaSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Programas
  app.get("/api/programas", async (_req, res) => {
    const programas = await storage.getProgramas();
    res.json(programas);
  });

  // Aulas
  app.get("/api/aulas", async (_req, res) => {
    const aulas = await storage.getAulas();
    res.json(aulas);
  });

  // Clases
  app.get("/api/clases", async (_req, res) => {
    const clases = await storage.getClases();
    res.json(clases);
  });

  // Estudiantes
  app.get("/api/estudiantes", async (_req, res) => {
    const estudiantes = await storage.getEstudiantes();
    res.json(estudiantes);
  });

  app.post("/api/estudiantes", async (req, res) => {
    try {
      const data = insertEstudianteSchema.parse(req.body);
      const estudiante = await storage.createEstudiante(data);
      res.json(estudiante);
    } catch (error) {
      res.status(400).json({ error: "Invalid data" });
    }
  });

  app.delete("/api/estudiantes/:id", async (req, res) => {
    try {
      await storage.deleteEstudiante(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete" });
    }
  });

  // Notas
  app.get("/api/notas", async (_req, res) => {
    const notas = await storage.getNotas();
    res.json(notas);
  });

  app.get("/api/notas/clase/:claseId", async (req, res) => {
    const notas = await storage.getNotasByClase(req.params.claseId);
    res.json(notas);
  });

  app.post("/api/notas", async (req, res) => {
    try {
      const data = insertNotaSchema.parse(req.body);
      const nota = await storage.createNota(data);
      res.json(nota);
    } catch (error) {
      res.status(400).json({ error: "Invalid data" });
    }
  });

  app.patch("/api/notas/:id", async (req, res) => {
    try {
      const nota = await storage.updateNota(req.params.id, req.body);
      res.json(nota);
    } catch (error) {
      res.status(400).json({ error: "Failed to update" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
