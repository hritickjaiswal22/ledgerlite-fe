import { ReactNode, HTMLProps } from "react";

import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: HTMLProps<HTMLElement>["className"];
}

function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "p-6 border border-border bg-card rounded-[8px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Card;
