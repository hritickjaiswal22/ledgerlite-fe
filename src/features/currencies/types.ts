export interface Currency {
  id: string;
  code: string;
  symbol: string;
  name: string;
}

export type GetCurrenciesResponse = {
  data: Currency[];
};
