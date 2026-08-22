import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function CategoriesSkeletonCard() {
  return (
    <Card className="flex flex-col gap-4">
      {/* <div className="flex justify-between items-start ">
        <Skeleton className="h-15 w-15" />

        <Skeleton className="h-15 w-15" />
      </div> */}

      <Skeleton className="h-12 w-full" />

      <div className="flex justify-end">
        <Skeleton className="h-9 w-15" />
      </div>
    </Card>
  );
}

function CategoriesSkeleton() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <CategoriesSkeletonCard />

      <CategoriesSkeletonCard />

      <CategoriesSkeletonCard />

      <CategoriesSkeletonCard />

      <CategoriesSkeletonCard />

      <CategoriesSkeletonCard />
    </section>
  );
}

export default CategoriesSkeleton;
