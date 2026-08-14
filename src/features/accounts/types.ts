export type AccountType = "CASH" | "BANK" | "CREDIT_CARD";

export interface Account {
  type: AccountType;
  name: string;
  balance: number;
  id: string;
}

export interface AccountResponse {
  data: Array<Account>;
}

export interface AddAccountRequestPayload {
  name: string;
  type: AccountType;
  balance?: number;
}
