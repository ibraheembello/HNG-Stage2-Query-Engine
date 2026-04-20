import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { v7 as uuidv7 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync('./profiles.json', 'utf8'));
  const profiles = data.profiles;

  console.log(`Seeding ${profiles.length} profiles...`);

  for (const profile of profiles) {
    await prisma.profile.upsert({
      where: { name: profile.name },
      update: {},
      create: {
        id: uuidv7(),
        name: profile.name,
        gender: profile.gender,
        gender_probability: profile.gender_probability,
        age: profile.age,
        age_group: profile.age_group,
        country_id: profile.country_id,
        country_name: profile.country_name,
        country_probability: profile.country_probability,
      },
    });
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
