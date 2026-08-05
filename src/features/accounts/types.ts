type AccountType = "CASH" | "BANK" | "CREDIT_CARD";

export interface Account {
  type: AccountType;
  name: string;
  balance: number;
  id: string;
}
