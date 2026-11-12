// Instalación local en un solo paso: dependencias, archivo .env, base de datos y contenido inicial.
// Uso: npm run setup
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const run = (cmd) => {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: root });
};

const env = path.join(root, "server", ".env");
if (!fs.existsSync(env)) {
  fs.copyFileSync(path.join(root, "server", ".env.example"), env);
  console.log("✔ Creado server/.env a partir de .env.example");
}

run("npm install");
run("npm install --prefix server");
run("npm install --prefix client");
run("npm run db:setup --prefix server");

console.log(`
✅ Todo listo. Ahora ejecuta:  npm run dev
   Frontend: http://localhost:5173
   API:      http://localhost:4000/api/health
   Admin:    usa ADMIN_EMAIL y ADMIN_PASSWORD de server/.env
`);
