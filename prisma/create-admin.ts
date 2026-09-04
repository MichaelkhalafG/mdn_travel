import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

// Production-safe: creates (or resets the password of) the single admin from
// ADMIN_EMAIL / ADMIN_PASSWORD. Idempotent — re-running updates the password.
const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set (see .env.example).");
  }
  const passwordHash = await hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "MDN Admin" },
  });
  console.log(`Admin user ready: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
