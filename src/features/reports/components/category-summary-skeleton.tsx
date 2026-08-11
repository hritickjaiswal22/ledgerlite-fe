import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function SkeletonCard() {
  return (
    <Card>
      <Skeleton className="h-7 w-2/3" />

      <div className="mt-6 flex flex-col gap-4">
        <Skeleton className="w-full h-6" />

        <Skeleton className="w-full h-6" />

        <Skeleton className="w-full h-6" />
      </div>
    </Card>
  );
}

function SkeletonCardRow() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <SkeletonCard />

      <SkeletonCard />
    </div>
  );
}

export default SkeletonCardRow;
