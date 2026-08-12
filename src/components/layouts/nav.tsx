// components/NavLinks.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Accounts", href: "/accounts" },
    { name: "Transactions", href: "/transactions" },
    { name: "Categories", href: "/categories" },
    { name: "Budgets", href: "/budgets" },
  ];

  return (
    <nav className="hidden md:flex items-center gap-4 ">
      {navLinks.map((item) => {
        // Handle exact match or nested routes if needed (e.g., /dashboard/profile)
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`text-base leading-6 text-muted-foreground font-medium cursor-pointer ${isActive ? "text-primary font-semibold border-b-2 border-primary" : ""}`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
