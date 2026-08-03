export interface SignUpRequestBody {
  email: string;
  password: string;
  selectedCurrencyId: string;
}

export interface SignInRequestBody {
  email: string;
  password: string;
}
