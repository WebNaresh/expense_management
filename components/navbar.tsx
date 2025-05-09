"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Home,
  LogOut,
  Menu,
  Receipt,
  Settings,
  User,
  Wallet,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/loans", label: "Loans", icon: Wallet },
  { href: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

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
      <div className="container relative flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] pl-2"
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
                  "relative text-sm font-medium transition-colors group px-3 py-2 rounded-md flex items-center gap-2",
                  isScrolled
                    ? "text-muted-foreground hover:text-primary hover:bg-primary/10"
                    : "text-white/90 hover:text-white hover:bg-white/10",
                  pathname === item.href && "bg-white/10 text-white"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <>
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
                    Welcome back, {session.user?.name || "User"}!
                  </p>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 hover:opacity-100 transition-opacity" />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative group"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
                      <User
                        className={cn(
                          "h-5 w-5 relative transition-colors duration-200",
                          isScrolled ? "text-emerald-600" : "text-white"
                        )}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  className={cn(
                    "transition-colors duration-200",
                    isScrolled
                      ? "border-primary text-primary hover:bg-primary/10"
                      : "border-white text-white hover:bg-white/10"
                  )}
                >
                  Sign In
                </Button>
              </Link>
            )}
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
            <SheetContent side="left" className="w-[300px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-auto py-2">
                  {navLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted",
                        pathname === item.href && "bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t p-4">
                  {session ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {session.user?.name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {session.user?.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="block"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button className="w-full justify-start gap-2">
                        <User className="w-4 h-4" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
