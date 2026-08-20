"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePickerSimple } from "@/components/ui/date-picker";
import { Account } from "@/features/accounts/types";
import { Category } from "@/features/categories/types";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { SelectOptions } from "./transactions";
import { addTransaction } from "@/app/actions";
import { TransactionType } from "../types";

interface AddTransactionFormProps {
  accounts: Array<Account>;
  categories: Array<Category>;
}

function AddTransactionForm({ accounts, categories }: AddTransactionFormProps) {
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [date, setDate] = useState<Date>();
  const [transactionType, setTransactionType] =
    useState<TransactionType>("expense");
  const [description, setDescription] = useState("");

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

  function resetForm() {
    setAmount(0);
    setSelectedAccountId(null);
    setSelectedCategoryId(null);
    setDate(undefined);
    setTransactionType("expense");
  }

  async function submitHandler() {
    if (
      amount > 0 &&
      selectedAccountId &&
      selectedCategoryId &&
      date &&
      transactionType
    ) {
      setLoading(true);

      const result = await addTransaction({
        accountId: selectedAccountId,
        amount,
        categoryId: selectedCategoryId,
        description,
        transactionDate: date.toISOString(),
        type: transactionType as TransactionType,
      });

      if (result.error) {
        toast.error(result.error || "Could not add item. Please try again.", {
          position: "top-right",
        });
      } else {
        setOpen(false);
        resetForm();
      }

      setLoading(false);
    }
  }

  return (
    <Dialog open={open}>
      <form>
        <DialogTrigger
          render={
            <Button
              onClick={() => setOpen(true)}
              size={"lg"}
              className={"rounded-2xl cursor-pointer"}
            >
              + Add Transaction
            </Button>
          }
        />

        <DialogContent showCloseButton={false} className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className={"text-2xl"}>Record Transaction</DialogTitle>
          </DialogHeader>

          <div className="p-6">
            <ToggleGroup
              variant="outline"
              className="grid grid-cols-2 gap-4 w-full mb-8"
              defaultValue={["expense"]}
              value={[transactionType]}
              onValueChange={(value) => {
                if (!value.length) return;
                setTransactionType(value[0] as TransactionType);
              }}
              size="lg"
            >
              <ToggleGroupItem
                className="w-full p-4"
                value="expense"
                aria-label="Toggle expense"
              >
                Expense
              </ToggleGroupItem>
              <ToggleGroupItem
                className="w-full p-4"
                value="income"
                aria-label="Toggle income"
              >
                Income
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                value={selectedAccountId}
                onValueChange={(value) => setSelectedAccountId(value)}
                required
                items={accountsOptions}
              >
                <SelectTrigger className="w-full">
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
                <SelectTrigger className="w-full">
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

              <Input
                type="number"
                min={0}
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />

              <DatePickerSimple
                date={date}
                setDate={setDate}
                triggerClass="w-full h-full min-h-14.5"
              />

              <div className="md:col-span-2">
                <Textarea
                  placeholder="Type your message here."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  variant="outline"
                  size={"lg"}
                  className={"cursor-pointer"}
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              }
            />
            <Button
              onClick={submitHandler}
              size={"lg"}
              className={"rounded-2xl cursor-pointer"}
              disabled={loading}
            >
              {loading && <Spinner data-icon="inline-start" />}
              Add Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default AddTransactionForm;
