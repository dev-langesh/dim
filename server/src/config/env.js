require("dotenv").config();
const { z } = require("zod");

const envSchema = z.object({
  PORT: z.string().default("8000"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  MONGODB_URI: z.string().url(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  RESET_PASSWORD_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
  RESET_PASSWORD_TOKEN_EXPIRY: z.string().default("15m"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_APP_NAME: z.string(),
  GITHUB_APP_ID: z.string(),
  GITHUB_APP_CLIENT_ID: z.string(),
  GITHUB_APP_CLIENT_SECRET: z.string(),
  BITBUCKET_CLIENT_ID: z.string(),
  BITBUCKET_CLIENT_SECRET: z.string(),
  BITBUCKET_CALLBACK_URL: z.string().url(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.log("Invalid environment variables:", env.error.format());
  process.exit(1);
}

module.exports = { env: env.data };
