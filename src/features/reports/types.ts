export interface MonthsSummaryResponse {
  data: {
    income: number;
    expense: number;
  };
}

export interface CategorySummaryResponse {
  data: Array<{
    categoryId: string;
    categoryName: string;
    amount: number;
  }>;
}

export interface BudgetSummaryResponse {
  data: Array<{
    id: string;
    categoryId: string;
    budget: number;
    category: string;
    spent: number;
    remaining: number;
    percentageUsed: string;
  }>;
}
