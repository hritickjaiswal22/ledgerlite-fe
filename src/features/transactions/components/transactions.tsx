"use client";

import { useEffect, useMemo, useState } from "react";
import { type DateRange } from "react-day-picker";
import { useQuery, useMutation } from "@tanstack/react-query";

import { Account } from "@/features/accounts/types";
import { Category } from "@/features/categories/types";
import {
  TransactionResponse,
  GetTransactionsParams,
} from "@/features/transactions/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DatePickerWithRange } from "@/components/ui/date-range";
import { Button } from "@/components/ui/button";

interface TransactionProps {
  accounts: Array<Account>;
  categories: Array<Category>;
}

interface SelectOptions {
  label: string;
  value: null | string;
}

function Transaction({ accounts, categories }: TransactionProps) {
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [transactionType, setTransactionType] = useState("all");
  const today = new Date();

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: today,
  });
  const {
    data: transactionResponse,
    error: transactionError,
    refetch,
  } = useQuery({
    queryKey: [
      "transactions",
      selectedAccountId,
      selectedCategoryId,
      transactionType,
      date?.from?.toISOString(),
      date?.to?.toISOString(),
    ],
    queryFn: getTransactions,
    enabled: false,
    retry: false,
  });

  const accountsOptions = useMemo(() => {
    const values: Array<SelectOptions> = accounts.map((account) => ({
      value: account.id,
      label: account.name,
    }));
    values.unshift({ label: "Select an account", value: null });

    return values;
  }, [accounts]);
  const categoriesOptions = useMemo(() => {
    const values: Array<SelectOptions> = categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));
    values.unshift({ label: "Select a category", value: null });

    return values;
  }, [categories]);

  function reset() {
    setSelectedAccountId(null);
    setSelectedCategoryId(null);
    setTransactionType("all");
    setDate({
      from: new Date(today.getFullYear(), today.getMonth(), 1),
      to: today,
    });
  }

  async function getTransactions(): Promise<TransactionResponse> {
    const params: GetTransactionsParams = {
      limit: 1,
    };
    if (selectedAccountId) {
      params.accountId = selectedAccountId;
    }
    if (selectedCategoryId) {
      params.categoryId = selectedCategoryId;
    }
    if (transactionType !== "all") {
      params.type = transactionType as "income" | "expense";
    }
    if (date) {
      params.startDate = date?.from;
      params.endDate = date?.to;
    }

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          searchParams.append(key, value.toISOString());
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/api/transactions${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(endpoint);

    if (!res.ok) {
      throw new Error("Failed to fetch transactions");
    }

    const { data } = await res.json();

    return data;
  }

  console.log(transactionResponse);

  return (
    <main>
      <div className="bg-card border border-border rounded-2xl p-4 mb-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <Select
            value={selectedAccountId}
            onValueChange={(value) => setSelectedAccountId(value)}
            required
            items={accountsOptions}
          >
            <SelectTrigger className="w-75">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select an account</SelectLabel>
                {accounts.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {`${item.name}`}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={selectedCategoryId}
            onValueChange={(value) => setSelectedCategoryId(value)}
            required
            items={categoriesOptions}
          >
            <SelectTrigger className="w-75">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a category</SelectLabel>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {`${item.name}`}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="border border-border p-2.75">
            <ToggleGroup
              variant="outline"
              size="lg"
              value={[transactionType]}
              onValueChange={(value) => {
                if (!value.length) return;
                setTransactionType(value[0]);
              }}
            >
              <ToggleGroupItem value="all" aria-label="Toggle all">
                All
              </ToggleGroupItem>
              <ToggleGroupItem value="expense" aria-label="Toggle expense">
                Expense
              </ToggleGroupItem>
              <ToggleGroupItem value="income" aria-label="Toggle income">
                Income
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>

        <div className="flex gap-4 justify-end mt-4 border-t border-border pt-4">
          <Button
            onClick={reset}
            variant="ghost"
            size={"default"}
            className={"cursor-pointer"}
          >
            Reset
          </Button>

          <Button
            onClick={() => refetch()}
            size={"default"}
            className={"rounded-2xl cursor-pointer"}
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {transactionError ? (
        <div className="bg-card border border-border rounded-2xl p-4 mb-8 shadow-sm">
          <h1 className="text-center text-2xl font-bold text-destructive">
            Error. Please try again
          </h1>
        </div>
      ) : transactionResponse &&
        transactionResponse.transactions.length > 0 ? null : (
        <div className="bg-card border border-border rounded-2xl p-4 mb-8 shadow-sm">
          <h1 className="text-center text-2xl font-bold text-card-foreground">
            No Data to show
          </h1>
        </div>
      )}
    </main>
  );
}

export default Transaction;
