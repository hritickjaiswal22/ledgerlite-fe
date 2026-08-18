import Transactions from "@/features/transactions/components/transactions";

function TransactionsPage() {
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
      </header>

      <Transactions />
    </section>
  );
}

export default TransactionsPage;
