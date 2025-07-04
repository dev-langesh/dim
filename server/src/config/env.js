require("dotenv").config();
const { z } = require("zod");

const envSchema = z.object({
  PORT: z.string().min(2).max(4).default("8000"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  MONGODB_URI: z.string().min(10).max(500).url(),
  ACCESS_TOKEN_SECRET: z.string().min(10).max(100),
  REFRESH_TOKEN_SECRET: z.string().min(10).max(100),
  RESET_PASSWORD_TOKEN_SECRET: z.string().min(10).max(100),
  ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
  RESET_PASSWORD_TOKEN_EXPIRY: z.string().default("15m"),
  GOOGLE_CLIENT_ID: z.string().min(10).max(100).optional(),
  SMTP_HOST: z.string().min(3).max(50),
  SMTP_PORT: z.string().min(1).max(5),
  SMTP_USER: z.string().min(3).max(100),
  SMTP_PASS: z.string().min(3).max(100),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.log("Invalid environment variables:", env.error.format());
  process.exit(1);
}

module.exports = { env: env.data };
