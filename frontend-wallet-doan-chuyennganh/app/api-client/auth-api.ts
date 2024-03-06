import { ISignInPayload } from "../common";
import axiosClient from "./axios-client";

export const authApi = {
  signIn(payload: ISignInPayload) {
    return axiosClient.post("/auth/sign-in", payload);
  },
  //signOut(){}
};
