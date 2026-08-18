import { cookies } from "next/headers";

import ErrorDisplay from "@/components/error-inline";
import { Account } from "@/features/accounts/types";
import { Category } from "@/features/categories/types";
import FiltersForm from "@/features/transactions/components/filtersForm";

async function Transactions() {
  // Await the cookies function to get the cookie store
  const cookieStore = await cookies();

  // Read a specific cookie
  const accessToken = cookieStore.get("access_token")?.value;

  const [accountsResponse, categoriesResponse] = await Promise.all([
    fetch(`${process.env.EXPRESS_API_URL}/accounts`, {
      method: "GET", // or 'POST', 'PUT', etc.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json", // Usually required when sending data
      },
    }),
    fetch(`${process.env.EXPRESS_API_URL}/categories`, {
      method: "GET", // or 'POST', 'PUT', etc.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json", // Usually required when sending data
      },
    }),
  ]);

  if (!accountsResponse.ok || !categoriesResponse.ok) {
    let data;

    if (!accountsResponse.ok) data = await accountsResponse.json();
    else if (!categoriesResponse.ok) data = await categoriesResponse.json();

    return <ErrorDisplay errorMessage={data.message} />;
  }

  const [accountData, categoriesData] = await Promise.all([
    accountsResponse.json(),
    categoriesResponse.json(),
  ]);

  const accounts: Array<Account> = accountData.data;
  const categories: Array<Category> = categoriesData.data;

  return (
    <main>
      <div className="bg-card border border-border rounded-2xl p-4 mb-8 shadow-sm">
        <FiltersForm accounts={accounts} categories={categories} />
      </div>
    </main>
  );
}

export default Transactions;
