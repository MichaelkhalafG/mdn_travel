import { cp, access } from "node:fs/promises";
import { join } from "node:path";

// Next's `output: "standalone"` bundles server.js + minimal node_modules but
// does NOT include the static assets or /public. Hostinger runs `npm run build`
// then the start command (`node .next/standalone/server.js`), so we copy both
// into the standalone tree here (runs automatically as npm `postbuild`).
// Cross-platform (fs.cp) so it works on the Windows dev machine and Linux host.
const root = process.cwd();
const standalone = join(root, ".next", "standalone");

async function main() {
  try {
    await access(standalone);
  } catch {
    console.error(
      "[postbuild] .next/standalone missing — is output:'standalone' set in next.config?"
    );
    process.exit(1);
  }

  await cp(join(root, ".next", "static"), join(standalone, ".next", "static"), {
    recursive: true,
  });
  await cp(join(root, "public"), join(standalone, "public"), { recursive: true });
  console.log("[postbuild] copied .next/static and public into .next/standalone");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
