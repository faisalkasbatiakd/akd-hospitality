#!/usr/bin/env node
/**
 * Runs a command with .env.local loaded.
 *
 * drizzle-kit reads DATABASE_URL from the environment, and there is no portable
 * way to set it inline in an npm script across Windows and POSIX shells. Node's
 * own --env-file only applies to the Node process it starts, not to a child
 * binary, so the values are read here and passed down explicitly.
 *
 * Usage: node scripts/with-env.mjs drizzle-kit migrate
 */
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ENV_FILE = process.env.ENV_FILE ?? ".env.local";

function loadEnv(file) {
  let raw;
  try {
    raw = readFileSync(resolve(process.cwd(), file), "utf8");
  } catch {
    console.error(
      `${file} not found. Copy .env.example to ${file} and fill it in.`,
    );
    process.exit(1);
  }

  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // Strip one layer of matching quotes, so a password containing # or spaces
    // can be quoted in the file without the quotes reaching Postgres.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const [command, ...args] = process.argv.slice(2);
if (!command) {
  console.error("Usage: node scripts/with-env.mjs <command> [args...]");
  process.exit(1);
}

const child = spawn(command, args, {
  stdio: "inherit",
  shell: true, // needed on Windows to resolve .cmd shims in node_modules/.bin
  env: { ...process.env, ...loadEnv(ENV_FILE) },
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
