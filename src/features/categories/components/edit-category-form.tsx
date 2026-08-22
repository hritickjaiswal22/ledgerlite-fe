"use client";

import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
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
import { Category } from "@/features/categories/types";
import { Spinner } from "@/components/ui/spinner";
import { editCategory } from "@/app/actions";

type EditCategoryFormProps = Category;

function EditCategoryForm({ id, name }: EditCategoryFormProps) {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState(name || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCategoryName(name || "");
  }, [name]);

  function resetForm() {
    setCategoryName("");
  }

  async function submitHandler() {
    if (categoryName) {
      setLoading(true);

      const result = await editCategory(id, categoryName);

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
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default EditCategoryForm;
