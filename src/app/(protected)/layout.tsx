import { ReactNode } from "react";
import Header from "@/components/layouts/header";

function ProtectedScreensLayout({ children }: { children: ReactNode }) {
  return (
    <article className="min-h-screen bg-background pt-16">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </article>
  );
}

export default ProtectedScreensLayout;
