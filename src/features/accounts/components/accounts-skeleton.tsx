import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function AccountsSkeleton() {
  return (
    <div>
      <Card className="mb-12">
        <Skeleton className="h-4 w-1/3 mb-4" />

        <Skeleton className="h-11 w-1/3" />
      </Card>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex justify-between items-start mb-8">
            <Skeleton className="h-12 w-12" />

            <Skeleton className="h-12 w-12" />
          </div>

          <Skeleton className="h-8 w-full mb-3" />

          <Skeleton className="h-8 w-full" />
        </Card>

        <Card>
          <div className="flex justify-between items-start mb-8">
            <Skeleton className="h-12 w-12" />

            <Skeleton className="h-12 w-12" />
          </div>

          <Skeleton className="h-8 w-full mb-3" />

          <Skeleton className="h-8 w-full" />
        </Card>

        <Card>
          <div className="flex justify-between items-start mb-8">
            <Skeleton className="h-12 w-12" />

            <Skeleton className="h-12 w-12" />
          </div>

          <Skeleton className="h-8 w-full mb-3" />

          <Skeleton className="h-8 w-full" />
        </Card>
      </section>
    </div>
  );
}

export default AccountsSkeleton;
