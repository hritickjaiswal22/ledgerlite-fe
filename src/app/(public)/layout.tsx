import { ReactNode } from "react";
import ThemeToggler from "@/components/theme-toggle";

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <article className="min-h-screen bg-[#faf8ff] bg-[radial-gradient(at_0%_0%,hsla(243,75%,95%,1)_0,transparent_50%),radial-gradient(at_50%_0%,hsla(243,75%,98%,1)_0,transparent_50%),radial-gradient(at_100%_0%,hsla(243,75%,95%,1)_0,transparent_50%)] dark:bg-slate-950 dark:bg-[radial-gradient(at_0%_0%,hsla(243,75%,5%,1)_0,transparent_50%),radial-gradient(at_50%_0%,hsla(243,75%,8%,1)_0,transparent_50%),radial-gradient(at_100%_0%,hsla(243,75%,5%,1)_0,transparent_50%)]">
      {/* Using direct static color since it is a single instance only */}
      <header className="flex justify-between items-center px-4 md:px-12 py-4 fixed top-0 left-0 right-0 w-full">
        <span className="text-foreground text-headline-lg font-bold">
          LedgerLite
        </span>

        <ThemeToggler />
      </header>

      {children}
    </article>
  );
}

export default AuthLayout;
