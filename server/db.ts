import 'dotenv/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Asegurar que la variable exista
if (!process.env.DATABASE_URL) {
  throw new Error(
    "❌ DATABASE_URL must be set. Netlify is missing the environment variable."
  );
}

// Configuración para Neon + Netlify (SSL obligatorio)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const db = drizzle({
  client: pool,
  schema
});
