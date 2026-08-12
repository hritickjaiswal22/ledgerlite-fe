import { Suspense } from "react";

import AccountsDetails from "@/features/accounts/components/accounts";
import AccountsSkeleton from "@/features/accounts/components/accounts-skeleton";
import AddAccountForm from "@/features/accounts/components/add-account-form";

function Accounts() {
  return (
    <section>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl leading-11 font-bold text-foreground">
            Accounts
          </h1>

          <p className="text-muted-foreground mt-2">
            Manage your bank accounts, wallets, and cash flow{" "}
          </p>
        </div>

        <AddAccountForm />
      </header>

      <Suspense fallback={<AccountsSkeleton />}>
        <AccountsDetails />
      </Suspense>
    </section>
  );
}

export default Accounts;
