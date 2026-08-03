"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { signin } from "@/features/auth/api";

function SigninForm() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: signin,
    onSuccess: () => {
      router.replace("/accounts");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "");
    },
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submitHandler() {
    if (email && password) {
      mutate({
        email,
        password,
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

      <Button
        type="submit"
        size={"lg"}
        className={"w-full"}
        disabled={isPending}
      >
        {isPending && <Spinner data-icon="inline-start" />}
        Sign in
      </Button>
    </form>
  );
}

export default SigninForm;
