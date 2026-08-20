import { cookies } from "next/headers";

import Transactions from "@/features/transactions/components/transactions";
import ErrorDisplay from "@/components/error-inline";
import { Account } from "@/features/accounts/types";
import { Category } from "@/features/categories/types";
import AddTransactionForm from "@/features/transactions/components/add-transaction-form";

async function TransactionsPage() {
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
    <section>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl leading-11 font-bold text-foreground">
            Transactions
          </h1>

          <p className="text-muted-foreground mt-2">
            Manage and track your financial movements across all accounts.
          </p>
        </div>

        <AddTransactionForm accounts={accounts} categories={categories} />
      </header>

      <Transactions accounts={accounts} categories={categories} />
    </section>
  );
}

export default TransactionsPage;
