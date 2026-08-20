"use client";

import { useEffect, useMemo, useState } from "react";
import { type DateRange } from "react-day-picker";
import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  QueryFunctionContext,
} from "@tanstack/react-query";

import { Account } from "@/features/accounts/types";
import { Category } from "@/features/categories/types";
import {
  TransactionResponse,
  GetTransactionsParams,
  TransactionType,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatDate } from "@/lib/utils";
import TransactionTablesSkeleton from "@/features/transactions/components/transactions-table-skeleton";

interface TransactionProps {
  accounts: Array<Account>;
  categories: Array<Category>;
}

export interface SelectOptions {
  label: string;
  value: null | string;
}

type TransactionFilters = {
  selectedAccountId?: string | null;
  selectedCategoryId?: string | null;
  transactionType: "all" | TransactionType; // Replace string with your TransactionType
  date?: {
    from: Date;
    to: Date;
  } | null;
};

type TransactionQueryKey = ["transactions", TransactionFilters];
type PageParamType = TransactionResponse["nextCursor"] | null;

async function getTransactions({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<
  TransactionQueryKey,
  PageParamType
>): Promise<TransactionResponse> {
  const [_key, filters] = queryKey;

  const params: GetTransactionsParams = {
    limit: 10,
  };
  if (filters?.selectedAccountId) {
    params.accountId = filters?.selectedAccountId;
  }
  if (filters?.selectedCategoryId) {
    params.categoryId = filters?.selectedCategoryId;
  }
  if (filters?.transactionType !== "all") {
    params.type = filters?.transactionType as "income" | "expense";
  }
  if (filters?.date) {
    params.startDate = filters?.date?.from;
    params.endDate = filters?.date?.to;
  }
  if (pageParam) {
    params.cursorId = pageParam.cursorId;
    params.cursorDate = pageParam.cursorDate;
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

function Transaction({ accounts, categories }: TransactionProps) {
  const today = new Date();

  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [transactionType, setTransactionType] = useState("all");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: today,
  });
  const [appliedFilters, setAppliedFilters] = useState<TransactionFilters>({
    transactionType: "all",
    date: {
      from: new Date(today.getFullYear(), today.getMonth(), 1),
      to: today,
    },
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error: transactionError,
  } = useInfiniteQuery({
    queryKey: ["transactions", appliedFilters],
    queryFn: getTransactions,
    getNextPageParam: (lastPage) => {
      // If hasNextPage is true, return the cursor object.
      // This object becomes the 'pageParam' for the next fetch request.
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
    },
  });

  const transactions = data?.pages.flatMap((page) => page.transactions) ?? [];

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

  function handleApplyFilters() {
    const temp: TransactionFilters = {
      transactionType: "all",
    };

    if (selectedAccountId) {
      temp.selectedAccountId = selectedAccountId;
    }
    if (selectedCategoryId) {
      temp.selectedCategoryId = selectedCategoryId;
    }
    if (transactionType !== "all") {
      temp.transactionType = transactionType as "income" | "expense";
    }
    if (date && date.from && date.to) {
      temp.date = {
        from: date.from,
        to: date.to,
      };
    }

    setAppliedFilters(temp);
  }

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
            onClick={handleApplyFilters}
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
      ) : isLoading ? (
        <TransactionTablesSkeleton />
      ) : transactions.length > 0 ? (
        <div className="rounded-2xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="uppercase">Date</TableHead>
                <TableHead className="uppercase">Category</TableHead>
                <TableHead className="uppercase">Description</TableHead>
                <TableHead className="uppercase">Account</TableHead>
                <TableHead className="uppercase">Type</TableHead>
                <TableHead className="uppercase">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions.map((transaction) => {
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <span className="text-[14px] leading-5 font-normal">
                        {formatDate(transaction.transactionDate) || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {categories.find(
                        (category) => category.id === transaction.categoryId,
                      )?.name || "N/A"}
                    </TableCell>
                    <TableCell>{transaction.description || "N/A"}</TableCell>
                    <TableCell>
                      {accounts.find(
                        (account) => account.id === transaction.accountId,
                      )?.name || "N/A"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                          transaction.transactionType === "expense"
                            ? "bg-loss text-loss-foreground"
                            : "bg-profit text-profit-foreground",
                        )}
                      >
                        {transaction.transactionType.toUpperCase() || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-bold",
                          transaction.transactionType === "expense"
                            ? "text-loss-foreground"
                            : "text-profit-foreground",
                        )}
                      >
                        {transaction.transactionType === "expense"
                          ? `- ${transaction.amount}`
                          : `+ ${transaction.amount}`}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="px-6 py-4 bg-card flex justify-center items-center">
            {hasNextPage && (
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="ghost"
                size={"sm"}
                className={"cursor-pointer"}
              >
                {isFetchingNextPage ? "Loading more..." : "View More"}
              </Button>
            )}
          </div>
        </div>
      ) : (
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
