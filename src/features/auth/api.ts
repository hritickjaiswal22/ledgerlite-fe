import axiosInstance from "@/lib/axios";
import { SignUpRequestBody, SignInRequestBody } from "./types";

export async function signup(body: SignUpRequestBody) {
  const data = await axiosInstance.post("/auth/signup", body);

  return data.data;
}

export async function signin(body: SignInRequestBody) {
  const data = await axiosInstance.post("/auth/signin", body);

  return data.data;
}
