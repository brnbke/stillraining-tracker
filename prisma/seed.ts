import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Hash password for all users
  const hashedPassword = await bcrypt.hash("password123", 12);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Created admin user:", admin.email);

  // Create test users
  const user1 = await prisma.user.upsert({
    where: { email: "user1@example.com" },
    update: {},
    create: {
      email: "user1@example.com",
      name: "Test User 1",
      password: hashedPassword,
      role: "USER",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "user2@example.com" },
    update: {},
    create: {
      email: "user2@example.com",
      name: "Test User 2",
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log("✅ Created test users:", user1.email, user2.email);

  // Create sample data entries for user1
  const dataEntries1 = await Promise.all([
    prisma.dataEntry.create({
      data: {
        userId: user1.id,
        value1: 10.5,
        value2: 25.3,
        value3: 8.7,
      },
    }),
    prisma.dataEntry.create({
      data: {
        userId: user1.id,
        value1: 12.1,
        value2: 23.8,
        value3: 9.2,
      },
    }),
    prisma.dataEntry.create({
      data: {
        userId: user1.id,
        value1: 9.8,
        value2: 27.1,
        value3: 7.9,
      },
    }),
  ]);

  // Create sample data entries for user2
  const dataEntries2 = await Promise.all([
    prisma.dataEntry.create({
      data: {
        userId: user2.id,
        value1: 15.2,
        value2: 30.5,
        value3: 12.1,
      },
    }),
    prisma.dataEntry.create({
      data: {
        userId: user2.id,
        value1: 14.7,
        value2: 28.9,
        value3: 11.8,
      },
    }),
  ]);

  console.log(
    `✅ Created ${dataEntries1.length} data entries for ${user1.email}`
  );
  console.log(
    `✅ Created ${dataEntries2.length} data entries for ${user2.email}`
  );

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
