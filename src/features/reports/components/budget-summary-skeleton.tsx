import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function BudgetSummarySkeleton() {
  return (
    <Card className="mt-6">
      <Skeleton className="h-8 w-1/3" />

      <div className="mt-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="flex gap-4 mt-8" key={index}>
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 flex-1" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default BudgetSummarySkeleton;
