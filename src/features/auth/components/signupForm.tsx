"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { SignUpRequestBody } from "@/features/auth/types";
import { GetCurrenciesResponse } from "@/features/currencies/types";

function SignupForm() {
  const router = useRouter();
  const { data: currencies = [] } = useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrencies,
  });
  const { mutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      router.replace("/accounts");
    },
    onError: (error: any) => {
      toast.error(error.message || "Internal Server Error", {
        position: "top-right",
      });
    },
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<string | null>(
    null,
  );

  const currenciesItems = currencies.map((currency) => {
    return {
      label: `${currency.name} ${currency.symbol}`,
      value: currency.id || null,
    };
  });
  currenciesItems.unshift({
    value: null,
    label: "Your Currency",
  });

  async function getCurrencies() {
    const response = await fetch(`api/currencies`);
    const { data }: GetCurrenciesResponse = await response.json();

    return data;
  }

  async function signup(body: SignUpRequestBody) {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  }

  function submitHandler() {
    if (email && password && selectedCurrencyId) {
      mutate({
        email,
        password,
        selectedCurrencyId,
      });
    }
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        submitHandler();
      }}
    >
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        placeholder="you@example.com"
      />
      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
      />
      <Select
        value={selectedCurrencyId}
        onValueChange={(value) => setSelectedCurrencyId(value)}
        required
        items={currenciesItems}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Your Currency</SelectLabel>
            {currencies.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {`${item.name} ${item.symbol}`}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        type="submit"
        size={"lg"}
        className={"w-full"}
        disabled={isPending}
      >
        {isPending && <Spinner data-icon="inline-start" />}
        Create Account
      </Button>
    </form>
  );
}

export default SignupForm;
