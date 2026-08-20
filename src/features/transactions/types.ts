export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  categoryId: string;
  accountId: string;
  amount: number;
  transactionDate: Date;
  description: string | null;
  transactionType: TransactionType;
}

export interface TransactionResponse {
  transactions: Array<Transaction>;
  hasNextPage: boolean;
  nextCursor: {
    cursorId: string;
    cursorDate: Date;
  } | null;
}

export interface GetTransactionsParams {
  limit?: 10 | 20 | 50;
  cursorId?: string;
  cursorDate?: string | Date;
  accountId?: string;
  categoryId?: string;
  type?: "income" | "expense";
  startDate?: string | Date;
  endDate?: string | Date;
}

export interface AddTransactionRequestPayload {
  accountId: string;
  categoryId: string;
  amount: number;
  type: "income" | "expense";
  transactionDate: string;
  description: string;
}
