import { ReactNode } from "react";
import Header from "@/components/layouts/header";

function ProtectedScreensLayout({ children }: { children: ReactNode }) {
  return (
    <article className="min-h-screen bg-background pt-16">
      <Header />

      {children}
    </article>
  );
}

export default ProtectedScreensLayout;
