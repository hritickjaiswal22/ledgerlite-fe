import { cookies } from "next/headers";

import Card from "@/components/ui/card";
import { CategorySummaryResponse } from "@/features/reports/types";
import { cn, randomColorGenerator } from "@/lib/utils";

async function CategorySummary() {
  // Await the cookies function to get the cookie store
  const cookieStore = await cookies();
  // Read a specific cookie
  const accessToken = cookieStore.get("access_token")?.value;
  const now = new Date();
  const year = now.getFullYear(); // e.g., 2026
  const month = now.getMonth() + 1; // e.g., 8 (August)

  const [expenseResponse, incomeResponse] = await Promise.all([
    fetch(
      `${process.env.EXPRESS_API_URL}/reports/category-summary?month=${month}&year=${year}&type=expense`,
      {
        method: "GET", // or 'POST', 'PUT', etc.
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // Usually required when sending data
        },
      },
    ),
    fetch(
      `${process.env.EXPRESS_API_URL}/reports/category-summary?month=${month}&year=${year}&type=income`,
      {
        method: "GET", // or 'POST', 'PUT', etc.
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // Usually required when sending data
        },
      },
    ),
  ]);

  if (!expenseResponse.ok || !incomeResponse.ok) return <h1>Error</h1>;

  const { data: expenses } =
    (await expenseResponse.json()) as CategorySummaryResponse;
  const { data: incomes } =
    (await incomeResponse.json()) as CategorySummaryResponse;

  const expenseTotal = expenses.reduce(
    (acc, obj) => Number(obj.amount || 0) + acc,
    0,
  );
  const incomesTotal = incomes.reduce(
    (acc, obj) => Number(obj.amount || 0) + acc,
    0,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card>
        <div>
          <h3 className="text-[20px] leading-7 font-semibold text-card-foreground">
            Expense Breakdown by Category
          </h3>

          <div className="flex flex-col gap-4 mt-6">
            {expenses.map((expense) => (
              <div
                key={expense.categoryId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn("w-3 h-3 rounded-full")}
                    style={{ backgroundColor: randomColorGenerator() }}
                  ></span>
                  <span className="text-base font-normal text-muted-foreground">
                    {expense.categoryName}
                  </span>
                </div>
                <span className="p-1 rounded-xs bg-secondary text-[14px] leading-5 text-secondary-foreground font-normal flex justify-center items-center">
                  {((expense.amount / expenseTotal) * 100).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div>
          <h3 className="text-[20px] leading-7 font-semibold text-card-foreground mb-6">
            Income Breakdown by Source
          </h3>

          {incomes.map((income) => (
            <div key={income.categoryId}>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[14px] leading-5 font-normal text-secondary-foreground">
                    {income.categoryName}
                  </span>
                  <span className="text-[14px] leading-5 font-normal text-secondary-foreground">
                    {((income.amount / incomesTotal) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="h-4 w-full bg-[#E2E7FF] rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full",
                      `${(income.amount / incomesTotal) * 100}%`,
                    )}
                    style={{ backgroundColor: randomColorGenerator() }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default CategorySummary;
