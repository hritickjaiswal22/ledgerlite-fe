"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { AccountType } from "@/features/accounts/types";
import { addAccount } from "@/app/actions";
import { Spinner } from "@/components/ui/spinner";

function AddAccountForm() {
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [balance, setBalance] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const accountTypes = [
    {
      value: null,
      label: "Account Type",
    },
    {
      value: "CASH",
      label: "Cash",
    },
    {
      value: "BANK",
      label: "Bank",
    },
    {
      value: "CREDIT_CARD",
      label: "Credit Card",
    },
  ];

  function resetForm() {
    setAccountName("");
    setAccountType(null);
    setBalance(0);
  }

  async function submitHandler() {
    if (accountName && accountType) {
      setLoading(true);

      const result = await addAccount({
        name: accountName,
        type: accountType,
        balance,
      });

      if (result.error) {
        toast.error(result.error || "Could not add item. Please try again.", {
          position: "top-right",
        });
      } else {
        resetForm();
        setOpen(false);
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
              + Add Account
            </Button>
          }
        />

        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className={"text-2xl"}>Add New Account</DialogTitle>
          </DialogHeader>

          <div className="p-6 flex flex-col gap-6">
            <Input
              type="text"
              required
              placeholder="Account Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />

            <Select
              value={accountType}
              onValueChange={(value) => setAccountType(value)}
              required
              items={accountTypes}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Account Type</SelectLabel>
                  {accountTypes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Input
              type="number"
              min={0}
              placeholder="Initial Balance"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
            />
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  variant="ghost"
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
              Save Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default AddAccountForm;
