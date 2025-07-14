const { z } = require("zod");

const deployPipelineSchema = z.object({
  body: z
    .object({
      ssh: z.object({
        host: z
          .string({ required_error: "Host is required" })
          .min(1, { message: "Host cannot be empty" }),

        port: z
          .number({ message: "Port must be a number" })
          .min(1, { message: "Port must be at least 1" })
          .max(65535, { message: "Port must be at most 65535" })
          .default(22),

        user: z
          .string({ required_error: "Username is required" })
          .min(1, { message: "Username cannot be empty" }),

        password: z.string().optional().or(z.literal("")), // allow blank if using privateKey

        privateKey: z.string().optional().or(z.literal("")), // allow blank if using password
      }),
    })
    .refine((data) => data.ssh.password || data.ssh.privateKey, {
      message: "Either password or privateKey must be provided",
      path: ["ssh", "password"], // Point to one of the fields for error clarity
    }),
});

const checkOsSchema = z.object({
  body: z
    .object({
      host: z
        .string({ required_error: "Host is required" })
        .min(1, { message: "Host cannot be empty" }),

      port: z
        .number({ message: "Port must be a number" })
        .min(1, { message: "Port must be at least 1" })
        .max(65535, { message: "Port must be at most 65535" })
        .default(22),

      username: z
        .string({ required_error: "Username is required" })
        .min(1, { message: "Username cannot be empty" }),

      password: z.string().optional().or(z.literal("")), // allow blank if using privateKey

      privateKey: z.string().optional().or(z.literal("")), // allow blank if using password
    })
    .refine((data) => data.password || data.privateKey, {
      message: "Either password or privateKey must be provided",
    }),
});

const deployInputSchema = {
  deployPipelineSchema,
  checkOsSchema,
};

module.exports = {
  deployInputSchema,
};
