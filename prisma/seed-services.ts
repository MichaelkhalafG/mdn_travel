import { PrismaClient } from "@prisma/client";
import { services } from "./services-data";

// Production-safe: upserts ONLY the 9 services (idempotent, no fake tickets).
// Run on first deploy and any time the seed service copy changes.
const prisma = new PrismaClient();

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log(`Seeded ${services.length} services.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
