import { cookies } from "next/headers";

import Card from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BudgetSummaryResponse } from "@/features/reports/types";
import { cn } from "@/lib/utils";

async function BudgetSummary() {
  // Await the cookies function to get the cookie store
  const cookieStore = await cookies();
  // Read a specific cookie
  const accessToken = cookieStore.get("access_token")?.value;
  const now = new Date();
  const year = now.getFullYear(); // e.g., 2026
  const month = now.getMonth() + 1; // e.g., 8 (August)

  const response = await fetch(
    `${process.env.EXPRESS_API_URL}/reports/budget-summary?month=${month}&year=${year}`,
    {
      method: "GET", // or 'POST', 'PUT', etc.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json", // Usually required when sending data
      },
    },
  );

  if (!response.ok) return <h1>Error</h1>;

  const { data } = (await response.json()) as BudgetSummaryResponse;

  console.log(data);

  return (
    <div className="mt-6 border border-border rounded-[8px]">
      <Card className="rounded-b-none border-0">
        <h1 className="text-headline-lg text-foreground font-semibold">
          Current Month Budgets
        </h1>
      </Card>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Visual Progress</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((budget) => {
              const status: "On Track" | "Warning" | "Exceeded" =
                Number(budget.percentageUsed) <= 70
                  ? "On Track"
                  : Number(budget.percentageUsed) < 100
                    ? "Warning"
                    : "Exceeded";

              return (
                <TableRow key={budget.id}>
                  <TableCell>
                    <span className="font-semibold">{budget.category}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-body-sm">
                      {budget.budget}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-body-sm">
                      {budget.spent}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-mono text-body-sm font-medium",
                        status === "On Track"
                          ? "text-profit-foreground"
                          : "text-loss-foreground",
                      )}
                    >
                      {budget.remaining}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold",
                        status === "On Track"
                          ? "text-profit-foreground bg-profit"
                          : "text-loss-foreground bg-loss",
                      )}
                    >
                      {status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="w-48 h-2 bg-[#E2E7FF] rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full",
                          status === "On Track"
                            ? "bg-profit-foreground"
                            : status === "Warning"
                              ? "bg-loss"
                              : "bg-loss-foreground",
                        )}
                        style={{
                          width: `${Number(budget.percentageUsed)}%`,
                        }}
                      ></div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default BudgetSummary;
