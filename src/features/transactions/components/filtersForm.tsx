"use client";

import { useMemo, useState } from "react";
import { type DateRange } from "react-day-picker";

import { Account } from "@/features/accounts/types";
import { Category } from "@/features/categories/types";
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

interface FiltersFormProps {
  accounts: Array<Account>;
  categories: Array<Category>;
}

function FiltersForm({ accounts, categories }: FiltersFormProps) {
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [transactionType, setTransactionType] = useState("all");
  const today = new Date();

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: today,
  });

  const accountsOptions = useMemo(() => {
    const values = accounts.map((account) => ({
      value: account.id,
      label: account.name,
    }));
    values.unshift({ label: "Select an account", value: null });

    return values;
  }, [accounts]);
  const categoriesOptions = useMemo(() => {
    const values = categories.map((category) => ({
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

  return (
    <div>
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

        <Button size={"default"} className={"rounded-2xl cursor-pointer"}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

export default FiltersForm;
