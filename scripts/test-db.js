// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log("🔍 Testing database connection...");

    // Test connection
    await prisma.$connect();
    console.log("✅ Database connection successful!");

    // Count users
    const userCount = await prisma.user.count();
    console.log(`👥 Total users: ${userCount}`);

    // Count data entries
    const dataEntryCount = await prisma.dataEntry.count();
    console.log(`📊 Total data entries: ${dataEntryCount}`);

    // Show recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: { dataEntries: true },
        },
      },
    });

    console.log("\n📋 Recent users:");
    recentUsers.forEach((user) => {
      console.log(
        `  - ${user.name || user.email} (${user._count.dataEntries} entries)`
      );
    });

    // Show recent data entries
    const recentEntries = await prisma.dataEntry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { email: true, name: true },
        },
      },
    });

    console.log("\n📈 Recent data entries:");
    recentEntries.forEach((entry) => {
      console.log(
        `  - ${entry.user.name || entry.user.email}: [${entry.value1}, ${
          entry.value2
        }, ${entry.value3}] at ${entry.createdAt.toISOString()}`
      );
    });
  } catch (error) {
    console.error("❌ Database error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
