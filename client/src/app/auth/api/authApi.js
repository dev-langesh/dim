import { api } from "@/api/axios";

export const authApi = {
  login: (body) => api.post("/auth/login", body),
  googleLogin: (body) => api.post("/auth/login/google", body),
  logout: () => api.post("/auth/logout"),
  register: (body) => api.post("/auth/register", body),
  status: () => api.get("/auth/status"),
  rotateTokens: () => api.post("/auth/rotate-tokens"),
  sendOtp: (body) => api.post("/auth/send-otp", body),
  verifyOtp: (body) => api.post("/auth/verify-otp", body),
  verifyOtpToResetPassword: (body) =>
    api.post("/auth/verify-otp-reset-password", body),
  resetPassword: (body) => api.post("/auth/reset-password", body),
};
