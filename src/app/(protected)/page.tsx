import { Suspense } from "react";

import MonthsSummary from "@/features/reports/components/months-summary";
import MonthsSummarySkeleton from "@/features/reports/components/months-summary-skeleton";
import CategorySummary from "@/features/reports/components/category-summary";
import CategorySummarySkeleton from "@/features/reports/components/category-summary-skeleton";
import BudgetSummary from "@/features/reports/components/budget-summary";
import BudgetSummarySkeleton from "@/features/reports/components/budget-summary-skeleton";

function Dashboard() {
  return (
    <>
      <Suspense fallback={<MonthsSummarySkeleton />}>
        <MonthsSummary />
      </Suspense>

      <Suspense fallback={<CategorySummarySkeleton />}>
        <CategorySummary />
      </Suspense>

      <Suspense fallback={<BudgetSummarySkeleton />}>
        <BudgetSummary />
      </Suspense>
    </>
  );
}

export default Dashboard;
