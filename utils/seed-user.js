import { db } from './index.js';
import { USERS } from './schema.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seedUsers() {
  const rawUsers = [
    { email: 'dtikone5@gmail.com', password: 'Admin12345@' },
    { email: 'tikonecricketgurukul@gmail.com', password: 'Tcg12345@' },
  ];

  for (const user of rawUsers) {
    // Check if user already exists
    const existing = await db.select().from(USERS).where(eq(USERS.email, user.email));

    if (existing.length === 0) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await db.insert(USERS).values({
        email: user.email,
        password: hashedPassword,
      });

      console.log(`✅ Inserted user: ${user.email}`);
    } else {
      console.log(`⚠️ User already exists: ${user.email}`);
    }
  }

  process.exit(0);
}

seedUsers().catch((err) => {
  console.error('❌ Error inserting users:', err);
  process.exit(1);
});