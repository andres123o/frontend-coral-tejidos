// Quita el fondo de todas las fotos en un directorio de origen y guarda los
// resultados como PNG con transparencia en un directorio de destino.
//
// Uso: node scripts/remove-background.mjs <carpeta-origen> <carpeta-destino>
//
// Usa @imgly/background-removal-node (JS/WASM, sin dependencias nativas de C++).
import { removeBackground } from "@imgly/background-removal-node";
import fs from "fs";
import path from "path";

const [, , srcDir, outDir] = process.argv;

if (!srcDir || !outDir) {
  console.error("Uso: node scripts/remove-background.mjs <carpeta-origen> <carpeta-destino>");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const mimeByExt = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };

const files = fs
  .readdirSync(srcDir)
  .filter((f) => mimeByExt[path.extname(f).toLowerCase()]);

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const mime = mimeByExt[ext];
  const inputBuffer = fs.readFileSync(path.join(srcDir, file));

  const outName = path.basename(file, ext).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".png";
  const outPath = path.join(outDir, outName);

  console.log(`Procesando ${file} -> ${outName}...`);
  const blob = await removeBackground(new Blob([inputBuffer], { type: mime }));
  const buffer = Buffer.from(await blob.arrayBuffer());
  fs.writeFileSync(outPath, buffer);
}

console.log(`Listo: ${files.length} imagen(es) procesada(s) en ${outDir}`);
