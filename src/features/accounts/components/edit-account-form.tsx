"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { editAccount } from "@/app/actions";
import { Account } from "@/features/accounts/types";
import { Spinner } from "@/components/ui/spinner";

interface EditAccountFormProps {
  account: Account;
}

function EditAccountForm({ account }: EditAccountFormProps) {
  const [accountName, setAccountName] = useState(account.name || "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAccountName(account.name || "");
  }, [account]);

  function resetForm() {
    setAccountName("");
  }

  async function submitHandler() {
    if (accountName) {
      setLoading(true);

      const result = await editAccount(account.id, accountName);

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
            <button
              onClick={() => setOpen(true)}
              className="p-3 rounded-xl opacity-90 bg-none group hover:bg-primary transition-colors cursor-pointer"
            >
              <Pencil className="text-primary transition-colors group-hover:text-white " />
            </button>
          }
        />

        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className={"text-2xl"}>Edit Account Name</DialogTitle>
          </DialogHeader>

          <div className="p-6 flex flex-col gap-6">
            <Input
              type="text"
              required
              placeholder="Account Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
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
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default EditAccountForm;
