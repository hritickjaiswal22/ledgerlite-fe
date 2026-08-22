"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { addCategory } from "@/app/actions";
import { Spinner } from "@/components/ui/spinner";

function AddAccountForm() {
  const [categoryName, setCategoryName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setCategoryName("");
  }

  async function submitHandler() {
    if (categoryName) {
      setLoading(true);

      const result = await addCategory(categoryName);

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
              + Add Category
            </Button>
          }
        />

        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className={"text-2xl"}>Add New Category</DialogTitle>
          </DialogHeader>

          <div className="p-6 flex flex-col gap-6">
            <Input
              type="text"
              required
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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
              Save Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default AddAccountForm;
