import { Suspense } from "react";

import Categories from "@/features/categories/components/categories";
import CategoriesSkeleton from "@/features/categories/components/categories-skeleton";
import AddCategoryForm from "@/features/categories/components/add-category-form";

function Accounts() {
  return (
    <section>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl leading-11 font-bold text-foreground">
            Categories
          </h1>

          <p className="text-muted-foreground mt-2">
            Organize your income and expense classification
          </p>
        </div>

        <AddCategoryForm />
      </header>

      <Suspense fallback={<CategoriesSkeleton />}>
        <Categories />
      </Suspense>
    </section>
  );
}

export default Accounts;
