const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name must be at most 50 characters" }),

    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Enter a valid email address" }),

    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(20, { message: "Password must be at most 20 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Enter a valid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .max(20, { message: "Password must be at most 20 characters" }),
  }),
});

const googleLoginSchema = z.object({
  body: z.object({
    idToken: z.string({ required_error: "ID token is required" }),
  }),
});

const sendOtpSchema = z.object({
  body: z.object({
    notificationType: z.enum(["email", "sms"], {
      required_error: "Notification type is required",
      invalid_type_error: "Notification type must be either 'email' or 'sms'",
    }),
    to: z
      .string({ required_error: "'To' field is required" })
      .min(1, { message: "'To' field cannot be empty" }),
    template: z.string().optional(),
  }),
});

const verifyOtpSchema = z.object({
  body: z.object({
    otp: z
      .string({ required_error: "OTP is required" })
      .length(6, { message: "OTP must be exactly 6 digits" }),
    to: z
      .string({ required_error: "'To' field is required" })
      .min(1, { message: "'To' field cannot be empty" }),
  }),
});

const verifyOtpToResetPasswordSchema = z.object({
  body: z.object({
    otp: z
      .string({ required_error: "OTP is required" })
      .length(6, { message: "OTP must be exactly 6 digits" }),
    to: z
      .string({ required_error: "'To' field is required" })
      .min(1, { message: "'To' field cannot be empty" }),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z
      .string({ required_error: "Reset token is required" })
      .min(1, { message: "Reset token cannot be empty" }),
    password: z
      .string({ required_error: "New password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .max(20, { message: "Password must be at most 20 characters" })
      .regex(/[A-Z]/, { message: "Must include at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Must include at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Must include at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Must include at least one special character",
      }),
  }),
});

const authInputSchema = {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  verifyOtpToResetPasswordSchema,
  resetPasswordSchema,
};

module.exports = { authInputSchema };
