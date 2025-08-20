const { z } = require("zod");

const githubCallbackSchema = z.object({
  query: z.object({
    code: z
      .string({ required_error: "GitHub code is required" })
      .min(1, { message: "GitHub code cannot be empty" }),
  }),
});

const repoInputSchema = {
  githubCallbackSchema,
};

module.exports = { repoInputSchema };