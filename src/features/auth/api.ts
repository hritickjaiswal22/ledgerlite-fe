import axiosInstance from "@/lib/axios";
import { SignUpRequestBody } from "./types";

export async function signup(body: SignUpRequestBody) {
  const data = await axiosInstance.post("/auth/signup", body);

  return data.data;
}
