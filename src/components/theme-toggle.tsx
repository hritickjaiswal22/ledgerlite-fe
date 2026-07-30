"use client";

import { Sun, Moon, Cpu } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ThemeToggler() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // To avoid hydartion issues
    setMounted(true);
  }, []);

  if (!mounted) return <span></span>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" aria-label="Toggle theme">
            {resolvedTheme === "light" ? (
              <Sun />
            ) : resolvedTheme === "dark" ? (
              <Moon />
            ) : (
              <Cpu />
            )}
          </Button>
        }
      />

      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            setTheme("light");
          }}
        >
          <Sun />
          Light
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setTheme("dark");
          }}
        >
          <Moon />
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setTheme("system");
          }}
        >
          <Cpu />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeToggler;
