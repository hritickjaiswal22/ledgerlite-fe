// components/DataErrorCallout.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface DataErrorCalloutProps {
  errorMessage?: string;
}

export default function DataErrorCallout({
  errorMessage = "Something went wrong while fetching the requested information.",
}: DataErrorCalloutProps) {
  const router = useRouter();

  return (
    <div className="p-6 my-4 mx-auto max-w-md bg-card rounded-xl border border-border shadow-sm text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-xl font-bold mb-3 mx-auto">
        ⚠️
      </div>
      <h3 className="text-lg font-semibold text-loss-foreground mb-1">
        Data Fetching Failed
      </h3>
      <p className="text-sm text-loss-foreground mb-4 leading-relaxed">
        {errorMessage}
      </p>
      <Button
        onClick={() => router.refresh()} // Pulls fresh data from the server
        size={"lg"}
        className="px-5 py-2 bg-destructive text-white text-sm font-medium rounded-md hover:bg-red-700 transition shadow-sm active:scale-95 cursor-pointer"
      >
        Click to Retry
      </Button>
    </div>
  );
}
