import Link from "next/link";

import SignupForm from "@/features/auth/components/signupForm";

function Signup() {
  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <main className="w-full max-w-105 rounded-xl shadow-xl overflow-hidden px-8 py-6 bg-card border border-border">
        <div className="text-center">
          <h1 className="text-headline-lg text-foreground font-semibold">
            Create your account
          </h1>

          <p className="text-body-sm mt-1 text-muted-foreground">
            Start tracking your income, expenses, and budgets
          </p>

          <div className="mt-8">
            <SignupForm />
          </div>

          <div className="mt-12 mb-8 h-px w-full border border-border"></div>

          <p className="text-body-sm text-secondary-foreground">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Signup;
