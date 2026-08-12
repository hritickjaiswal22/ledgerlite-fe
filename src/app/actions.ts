"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { AddAccountRequestPayload } from "@/features/accounts/types";

export async function addAccount(body: AddAccountRequestPayload) {
  try {
    // Await the cookies function to get the cookie store
    const cookieStore = await cookies();

    // Read a specific cookie
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) throw "Error";

    const response = await fetch(`${process.env.EXPRESS_API_URL}/accounts`, {
      method: "POST", // or 'POST', 'PUT', etc.
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json", // Usually required when sending data
      },
    });
    const data = await response.json();

    if (!response.ok) throw data?.message || "Error";

    revalidatePath("/accounts");

    return { error: null }; // success
  } catch (error) {
    return {
      error: (error as string) || "Could not add item. Please try again.",
    };
  }
}
