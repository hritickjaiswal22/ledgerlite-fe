"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { AddAccountRequestPayload } from "@/features/accounts/types";
import { AddTransactionRequestPayload } from "@/features/transactions/types";

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

export async function editAccount(accountId: string, newName: string) {
  try {
    // Await the cookies function to get the cookie store
    const cookieStore = await cookies();

    // Read a specific cookie
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) throw "Error";

    const response = await fetch(
      `${process.env.EXPRESS_API_URL}/accounts/${accountId}`,
      {
        method: "PATCH", // or 'POST', 'PUT', etc.
        body: JSON.stringify({
          name: newName,
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // Usually required when sending data
        },
      },
    );

    if (!response.ok) {
      const data = await response.json();

      throw data?.message || "Error";
    }

    revalidatePath("/accounts");

    return { error: null }; // success
  } catch (error) {
    return {
      error: (error as string) || "Could not add item. Please try again.",
    };
  }
}

export async function addTransaction(body: AddTransactionRequestPayload) {
  try {
    // Await the cookies function to get the cookie store
    const cookieStore = await cookies();

    // Read a specific cookie
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) throw "Error";

    const response = await fetch(
      `${process.env.EXPRESS_API_URL}/transactions`,
      {
        method: "POST", // or 'POST', 'PUT', etc.
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // Usually required when sending data
        },
      },
    );
    const data = await response.json();

    if (!response.ok) throw data?.message || "Error";

    revalidatePath("/transactions");

    return { error: null }; // success
  } catch (error) {
    return {
      error: (error as string) || "Could not add item. Please try again.",
    };
  }
}

export async function editCategory(categoryId: string, newName: string) {
  try {
    // Await the cookies function to get the cookie store
    const cookieStore = await cookies();

    // Read a specific cookie
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) throw "Error";

    const response = await fetch(
      `${process.env.EXPRESS_API_URL}/categories/${categoryId}`,
      {
        method: "PATCH", // or 'POST', 'PUT', etc.
        body: JSON.stringify({
          name: newName,
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // Usually required when sending data
        },
      },
    );

    if (!response.ok) {
      const data = await response.json();

      throw data?.message || "Error";
    }

    revalidatePath("/categories");

    return { error: null }; // success
  } catch (error) {
    return {
      error: (error as string) || "Could not add item. Please try again.",
    };
  }
}

export async function addCategory(name: string) {
  try {
    // Await the cookies function to get the cookie store
    const cookieStore = await cookies();

    // Read a specific cookie
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) throw "Error";

    const response = await fetch(`${process.env.EXPRESS_API_URL}/categories`, {
      method: "POST", // or 'POST', 'PUT', etc.
      body: JSON.stringify({
        name,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json", // Usually required when sending data
      },
    });
    const data = await response.json();

    if (!response.ok) throw data?.message || "Error";

    revalidatePath("/categories");

    return { error: null }; // success
  } catch (error) {
    return {
      error: (error as string) || "Could not add item. Please try again.",
    };
  }
}
