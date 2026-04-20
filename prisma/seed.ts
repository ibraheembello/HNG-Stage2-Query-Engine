import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { v7 as uuidv7 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync('./profiles.json', 'utf8'));
  const profiles = data.profiles;

  console.log(`Checking existing profiles...`);
  const existingProfiles = await prisma.profile.findMany({
    select: { name: true }
  });
  const existingNames = new Set(existingProfiles.map(p => p.name));

  const newProfiles = profiles.filter((p: any) => !existingNames.has(p.name));

  if (newProfiles.length === 0) {
    console.log('No new profiles to seed.');
    return;
  }

  console.log(`Seeding ${newProfiles.length} new profiles...`);

  // Batch insert for performance
  const batchSize = 100;
  for (let i = 0; i < newProfiles.length; i += batchSize) {
    const batch = newProfiles.slice(i, i + batchSize).map((p: any) => ({
      id: uuidv7(),
      name: p.name,
      gender: p.gender,
      gender_probability: p.gender_probability,
      age: p.age,
      age_group: p.age_group,
      country_id: p.country_id,
      country_name: p.country_name,
      country_probability: p.country_probability,
    }));

    await prisma.profile.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(`Seeded batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(newProfiles.length / batchSize)}`);
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
