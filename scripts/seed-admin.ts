import bcrypt from "bcryptjs";

async function main() {
  const password = process.argv[2] || "ImpactEnergy2026!";
  const email = process.argv[3] || "admin@impactenergysolution.com";

  const hash = await bcrypt.hash(password, 12);

  console.log("=== Impact Energy Solution Admin Credentials Setup ===");
  console.log(`Admin Email: ${email}`);
  console.log(`Plain Password: ${password}`);
  console.log(`Hashed Password (bcryptjs): ${hash}`);
  console.log("\nAdd these to your .env file or Vercel environment variables:");
  console.log(`ADMIN_EMAIL="${email}"`);
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log("=====================================================");
}

main().catch((err) => {
  console.error("Error generating admin credentials:", err);
  process.exit(1);
});
