// Temporary ambient module declarations to avoid TS errors
// for dev-time-only packages before `npm install` is run.
declare module "vite";
declare module "@vitejs/plugin-react";
// removed Replit-specific plugin declarations (not used locally)
declare module "path";
declare module "url";
declare module "dotenv";
declare module "drizzle-kit";

// allow importing CSS/modules in TS files inside client temporarily
declare module "*.css";
declare module "*.scss";

// Temporary global process declaration to avoid TS errors before @types/node is installed
declare var process: { env: { [key: string]: string | undefined } };
