export const actividadReciente = pgTable("actividad_reciente", {
  id: integer("id").primaryKey().notNull().default(sql`nextval('actividad_reciente_id_seq')`),
  usuario: varchar("usuario", { length: 100 }),
  accion: varchar("accion", { length: 255 }),
  detalles: text("detalles"),
  fecha: text("fecha"),
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const programas = pgTable("programas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull().unique(),
});

export const aulas = pgTable("aulas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  codigo: text("codigo").notNull().unique(),
  capacidad: integer("capacidad").notNull(),
});

export const clases = pgTable("clases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  codigo: text("codigo").notNull().unique(),
  nombre: text("nombre").notNull(),
  programaId: varchar("programa_id").notNull(),
  aulaId: varchar("aula_id").notNull(),
});

export const estudiantes = pgTable("estudiantes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  programaId: varchar("programa_id").notNull(),
  semestre: integer("semestre").notNull(),
  aulaId: varchar("aula_id").notNull(),
  claseId: varchar("clase_id").notNull(),
});

export const notas = pgTable("notas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  estudianteId: varchar("estudiante_id").notNull(),
  claseId: varchar("clase_id").notNull(),
  nota1: decimal("nota1", { precision: 3, scale: 1 }).default("0.0"),
  nota2: decimal("nota2", { precision: 3, scale: 1 }).default("0.0"),
  nota3: decimal("nota3", { precision: 3, scale: 1 }).default("0.0"),
  nota4: decimal("nota4", { precision: 3, scale: 1 }).default("0.0"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProgramaSchema = createInsertSchema(programas).omit({ id: true });
export const insertAulaSchema = createInsertSchema(aulas).omit({ id: true });
export const insertClaseSchema = createInsertSchema(clases).omit({ id: true });
export const insertEstudianteSchema = createInsertSchema(estudiantes).omit({ id: true });
export const insertNotaSchema = createInsertSchema(notas).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPrograma = z.infer<typeof insertProgramaSchema>;
export type Programa = typeof programas.$inferSelect;

export type InsertAula = z.infer<typeof insertAulaSchema>;
export type Aula = typeof aulas.$inferSelect;

export type InsertClase = z.infer<typeof insertClaseSchema>;
export type Clase = typeof clases.$inferSelect;

export type InsertEstudiante = z.infer<typeof insertEstudianteSchema>;
export type Estudiante = typeof estudiantes.$inferSelect;

export type InsertNota = z.infer<typeof insertNotaSchema>;
export type Nota = typeof notas.$inferSelect;
