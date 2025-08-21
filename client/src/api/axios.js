"use client";

import axios from "axios";
import { authApi } from "../app/auth/api/authApi"; // should export rotateTokens and logout

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

export const protectedApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

let isRefreshing = false;
let refreshPromise = null;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const redirectToSignIn = () => {
  window.location.href = `/auth/login?redirect=${window.location.pathname}`;
};

async function logout(redirect) {
  try {
    await authApi.logout();
  } catch (error) {
    console.error("Logout failed:", error);
  }
  if (redirect) {
    redirectToSignIn();
  }
}

async function responseErrorInterceptor(error, client = api, protectedApi) {
  const originalRequest = error.config;
  const errorCode = error?.response?.data?.errorCode;
  const status = error?.response?.status;

  if (!originalRequest) return Promise.reject(error);

  // Already retried, stop here
  if (originalRequest._retry) return Promise.reject(error);

  // Refresh token expired, logout
  if (errorCode === 2000) return await logout(protectedApi);
  // Access token expired, try rotating
  else if (errorCode === 2001) {
    if (isRefreshing) {
      if (!refreshPromise) {
        refreshPromise = new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }
      return refreshPromise.then(() => client(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      refreshPromise = authApi.rotateTokens();
      await refreshPromise;
      processQueue();
      return client(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      return await logout(protectedApi);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  }
  // else if (status === 401 && protectedApi && errorCode !== 2001)
  //   await logout(protectedApi);

  return Promise.reject(error);
}

// Attach interceptors
api.interceptors.response.use(
  (response) => response,
  (error) => responseErrorInterceptor(error, api)
);

protectedApi.interceptors.response.use(
  (response) => response,
  (error) => responseErrorInterceptor(error, protectedApi, true)
);
