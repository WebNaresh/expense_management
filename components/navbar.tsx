"use client";

import { Menu, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-center">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <div className="flex items-center justify-center gap-2">
            <Image src="/logo.png" alt="SpendIt" width={50} height={50} />
            <span className="text-xl font-bold">SpendIt</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/loans"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Loans
            </Link>
            <Link
              href="/subscriptions"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Subscriptions
            </Link>
            <Link
              href="/expenses"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Expenses
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <p className="text-sm font-medium">Welcome back, Naresh!</p>

            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-6 py-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Welcome back, Naresh!</p>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </div>
                <div className="grid gap-3">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/loans"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    Loans
                  </Link>
                  <Link
                    href="/subscriptions"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    Subscriptions
                  </Link>
                  <Link
                    href="/expenses"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    Expenses
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
