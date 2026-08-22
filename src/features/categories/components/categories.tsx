import { cookies } from "next/headers";
import {
  Wallet,
  Landmark,
  BanknoteArrowUp,
  CreditCard,
  Pencil,
} from "lucide-react";

import { CategoryResponse } from "@/features/categories/types";
import Card from "@/components/ui/card";
import EditCategoryForm from "@/features/categories/components/edit-category-form";
import ErrorDisplay from "@/components/error-inline";
import { cn, formatWithCommas } from "@/lib/utils";

async function Categories() {
  // Await the cookies function to get the cookie store
  const cookieStore = await cookies();

  // Read a specific cookie
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await fetch(`${process.env.EXPRESS_API_URL}/categories`, {
    method: "GET", // or 'POST', 'PUT', etc.
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json", // Usually required when sending data
    },
  });

  if (!response.ok) {
    const data = await response.json();

    return <ErrorDisplay errorMessage={data.message} />;
  }

  const { data }: CategoryResponse = await response.json();

  return (
    <main>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((category) => (
          <Card key={category.id}>
            <h3 className="text-2xl leading-8 font-semibold">
              {category.name}
            </h3>

            <div className="flex justify-end items-center mt-4">
              <EditCategoryForm id={category.id} name={category.name} />
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}

export default Categories;
