import axiosInstance from "@/lib/axios";
import { Currency, GetCurrenciesResponse } from "./types";

export async function getCurrencies() {
  const response =
    await axiosInstance.get<GetCurrenciesResponse>("/currencies");

  return response.data.data;
}
