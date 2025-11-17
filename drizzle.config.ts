// Disable TypeScript type checking in this config file until dev dependencies are installed
// (this avoids 'Cannot find module' errors for tools like dotenv/drizzle-kit)
// @ts-nocheck

import dotenv from "dotenv";
dotenv.config();
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
