import { cookies } from "next/headers";

import Card from "@/components/ui/card";
import ErrorDisplay from "@/components/error-inline";
import { MonthsSummaryResponse } from "@/features/reports/types";

async function MonthsSummary() {
  // Await the cookies function to get the cookie store
  const cookieStore = await cookies();
  // Read a specific cookie
  const accessToken = cookieStore.get("access_token")?.value;
  const now = new Date();
  const year = now.getFullYear(); // e.g., 2026
  const month = now.getMonth() + 1; // e.g., 8 (August)

  const response = await fetch(
    `${process.env.EXPRESS_API_URL}/reports/month-summary?month=${month}&year=${year}`,
    {
      method: "GET", // or 'POST', 'PUT', etc.
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json", // Usually required when sending data
      },
    },
  );

  if (!response.ok) {
    const data = await response.json();

    return <ErrorDisplay errorMessage={data.message} />;
  }

  const { data } = (await response.json()) as MonthsSummaryResponse;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-t-4 border-t-profit-foreground">
        <div>
          <p className="uppercase text-xs leading-4 font-semibold text-muted-foreground">
            Total Income
          </p>

          <h2 className="text-4xl leading-11 font-bold mt-3 text-profit-foreground">
            + {Number(data.income).toFixed(2)}
          </h2>
        </div>
      </Card>
      <Card className="border-t-4 border-t-loss-foreground">
        <div>
          <p className="uppercase text-xs leading-4 font-semibold text-muted-foreground">
            Total Expenses
          </p>

          <h2 className="text-4xl leading-11 font-bold mt-3 text-loss-foreground">
            - {Number(data.expense).toFixed(2)}
          </h2>
        </div>
      </Card>
      <Card className="border-t-4 border-t-primary">
        <div>
          <p className="uppercase text-xs leading-4 font-semibold text-muted-foreground">
            Net Savings
          </p>

          <h2 className="text-4xl leading-11 font-bold mt-3 text-primary">
            {Number(data.income - data.expense).toFixed(2)}
          </h2>
        </div>
      </Card>
    </div>
  );
}

export default MonthsSummary;
