import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function SkeletonCard() {
  return (
    <Card>
      <Skeleton className="h-4 w-2/3" />

      <Skeleton className="w-full h-11 mt-3" />
    </Card>
  );
}

function SkeletonCardRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SkeletonCard />

      <SkeletonCard />

      <SkeletonCard />
    </div>
  );
}

export default SkeletonCardRow;
