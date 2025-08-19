import { protectedApi } from "./axios";

export const userApi = {
  fetchUserData: () => protectedApi.get("/user/profile"),
};
