import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  User,
  InsertUser,
  Programa,
  InsertPrograma,
  Aula,
  InsertAula,
  Clase,
  InsertClase,
  Estudiante,
  InsertEstudiante,
  Nota,
  InsertNota,
} from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Please configure it in Replit Secrets or add it to .env file");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Programas
  getProgramas(): Promise<Programa[]>;
  getPrograma(id: string): Promise<Programa | undefined>;
  createPrograma(programa: InsertPrograma): Promise<Programa>;

  // Aulas
  getAulas(): Promise<Aula[]>;
  getAula(id: string): Promise<Aula | undefined>;
  createAula(aula: InsertAula): Promise<Aula>;

  // Clases
  getClases(): Promise<Clase[]>;
  getClase(id: string): Promise<Clase | undefined>;
  createClase(clase: InsertClase): Promise<Clase>;

  // Estudiantes
  getEstudiantes(): Promise<Estudiante[]>;
  getEstudiante(id: string): Promise<Estudiante | undefined>;
  createEstudiante(estudiante: InsertEstudiante): Promise<Estudiante>;
  deleteEstudiante(id: string): Promise<void>;

  // Notas
  getNotas(): Promise<Nota[]>;
  getNotasByClase(claseId: string): Promise<Nota[]>;
  getNotasByEstudiante(estudianteId: string): Promise<Nota[]>;
  createNota(nota: InsertNota): Promise<Nota>;
  updateNota(id: string, nota: Partial<InsertNota>): Promise<Nota>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(schema.users).values(insertUser).returning();
    return user;
  }

  // Programas
  async getProgramas(): Promise<Programa[]> {
    return await db.select().from(schema.programas);
  }

  async getPrograma(id: string): Promise<Programa | undefined> {
    const [programa] = await db.select().from(schema.programas).where(eq(schema.programas.id, id));
    return programa;
  }

  async createPrograma(insertPrograma: InsertPrograma): Promise<Programa> {
    const [programa] = await db.insert(schema.programas).values(insertPrograma).returning();
    return programa;
  }

  // Aulas
  async getAulas(): Promise<Aula[]> {
    return await db.select().from(schema.aulas);
  }

  async getAula(id: string): Promise<Aula | undefined> {
    const [aula] = await db.select().from(schema.aulas).where(eq(schema.aulas.id, id));
    return aula;
  }

  async createAula(insertAula: InsertAula): Promise<Aula> {
    const [aula] = await db.insert(schema.aulas).values(insertAula).returning();
    return aula;
  }

  // Clases
  async getClases(): Promise<Clase[]> {
    return await db.select().from(schema.clases);
  }

  async getClase(id: string): Promise<Clase | undefined> {
    const [clase] = await db.select().from(schema.clases).where(eq(schema.clases.id, id));
    return clase;
  }

  async createClase(insertClase: InsertClase): Promise<Clase> {
    const [clase] = await db.insert(schema.clases).values(insertClase).returning();
    return clase;
  }

  // Estudiantes
  async getEstudiantes(): Promise<Estudiante[]> {
    return await db.select().from(schema.estudiantes);
  }

  async getEstudiante(id: string): Promise<Estudiante | undefined> {
    const [estudiante] = await db.select().from(schema.estudiantes).where(eq(schema.estudiantes.id, id));
    return estudiante;
  }

  async createEstudiante(insertEstudiante: InsertEstudiante): Promise<Estudiante> {
    const [estudiante] = await db.insert(schema.estudiantes).values(insertEstudiante).returning();
    return estudiante;
  }

  async deleteEstudiante(id: string): Promise<void> {
    await db.delete(schema.estudiantes).where(eq(schema.estudiantes.id, id));
  }

  // Notas
  async getNotas(): Promise<Nota[]> {
    return await db.select().from(schema.notas);
  }

  async getNotasByClase(claseId: string): Promise<Nota[]> {
    return await db.select().from(schema.notas).where(eq(schema.notas.claseId, claseId));
  }

  async getNotasByEstudiante(estudianteId: string): Promise<Nota[]> {
    return await db.select().from(schema.notas).where(eq(schema.notas.estudianteId, estudianteId));
  }

  async createNota(insertNota: InsertNota): Promise<Nota> {
    const [nota] = await db.insert(schema.notas).values(insertNota).returning();
    return nota;
  }

  async updateNota(id: string, updateData: Partial<InsertNota>): Promise<Nota> {
    const [nota] = await db.update(schema.notas)
      .set(updateData)
      .where(eq(schema.notas.id, id))
      .returning();
    return nota;
  }
}

export const storage = new DatabaseStorage();
