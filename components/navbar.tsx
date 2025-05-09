"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/loans", label: "Loans" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/expenses", label: "Expenses" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={cn(
          "absolute inset-0 border-b border-white/10 backdrop-blur-md transition-colors duration-200",
          isScrolled ? "bg-white/5" : "bg-[#1ab57e]"
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-white/5 pointer-events-none" />
      <div className="container relative flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
          >
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 group-hover:opacity-30 blur transition duration-200" />
              <Image
                src="/logo.png"
                alt="SpendIt"
                width={50}
                height={50}
                className="relative"
              />
            </div>
            <span
              className={cn(
                "text-xl font-bold transition-colors duration-200",
                isScrolled
                  ? "bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500"
                  : "text-white"
              )}
            >
              SpendIt
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition-colors group",
                  isScrolled
                    ? "text-muted-foreground hover:text-primary"
                    : "text-white/90 hover:text-white"
                )}
              >
                {item.label}
                <span className="absolute inset-x-0 -bottom-[1px] h-[1px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/70 to-emerald-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <div
              className={cn(
                "relative px-4 py-2 rounded-full backdrop-blur-sm border transition-colors duration-200",
                isScrolled
                  ? "bg-white/5 border-white/10"
                  : "bg-white/10 border-white/20"
              )}
            >
              <p
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  isScrolled
                    ? "bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500"
                    : "text-white"
                )}
              >
                Welcome back, Naresh!
              </p>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 hover:opacity-100 transition-opacity" />
            </div>

            <Button variant="ghost" size="icon" className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
              <User
                className={cn(
                  "h-5 w-5 relative transition-colors duration-200",
                  isScrolled ? "text-emerald-600" : "text-white"
                )}
              />
            </Button>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "relative md:hidden group border-white/10 transition-colors duration-200",
                  isScrolled ? "bg-white/5" : "bg-white/10"
                )}
              >
                <div className="absolute inset-0 rounded-md bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
                <Menu
                  className={cn(
                    "h-5 w-5 relative transition-colors duration-200",
                    isScrolled ? "text-muted-foreground" : "text-white"
                  )}
                />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-white/95 backdrop-blur-xl border-white/20"
            >
              <div className="grid gap-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="relative px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                    <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
                      Welcome back, Naresh!
                    </p>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative group"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
                    <User className="h-5 w-5 relative text-emerald-600" />
                  </Button>
                </div>
                <div className="grid gap-3">
                  {navLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="relative group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary p-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
