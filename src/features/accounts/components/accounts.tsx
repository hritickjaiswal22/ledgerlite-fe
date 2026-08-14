import { cookies } from "next/headers";
import {
  Wallet,
  Landmark,
  BanknoteArrowUp,
  CreditCard,
  Pencil,
} from "lucide-react";

import { AccountResponse } from "@/features/accounts/types";
import Card from "@/components/ui/card";
import EditAccountForm from "@/features/accounts/components/edit-account-form";
import ErrorDisplay from "@/components/error-inline";
import { cn, formatWithCommas } from "@/lib/utils";

async function Accounts() {
  // Await the cookies function to get the cookie store
  const cookieStore = await cookies();

  // Read a specific cookie
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await fetch(`${process.env.EXPRESS_API_URL}/accounts`, {
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

  const { data }: AccountResponse = await response.json();
  const totalBalance = data.reduce(
    (acc, account) => acc + Number(account.balance),
    0,
  );

  return (
    <main>
      <section className="mb-12">
        <Card className="relative">
          <div className="absolute top-2 right-6 opacity-10 hover:opacity-20">
            <Wallet size={100} />
          </div>

          <p className="text-muted-foreground font-semibold leading-4 text-xs mb-4">
            TOTAL BALANCE{" "}
          </p>

          <h2 className="text-4xl leading-11 font-bold text-primary">
            {formatWithCommas(totalBalance)}
          </h2>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((account) => (
          <Card key={account.id}>
            <div className="flex justify-between items-start mb-8">
              <div
                className={cn(
                  "p-3 rounded-xl opacity-90",
                  account.type === "BANK" || account.type === "CASH"
                    ? "bg-primary"
                    : "bg-destructive",
                )}
              >
                {account.type === "BANK" ? (
                  <Landmark className="text-white" />
                ) : account.type === "CASH" ? (
                  <BanknoteArrowUp className="text-white" />
                ) : (
                  <CreditCard className="text-white" />
                )}
              </div>

              <EditAccountForm account={account} />
            </div>

            <h3 className="text-headline-lg font-semibold text-foreground mb-3">
              {account.name}
            </h3>

            <p className="text-headline-lg font-bold text-foreground">
              {formatWithCommas(account.balance)}
            </p>
          </Card>
        ))}
      </section>
    </main>
  );
}

export default Accounts;
