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
import { Skeleton } from "@/components/ui/skeleton";
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
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Navigation links for authenticated users
const protectedNavLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/loans", label: "Loans", icon: Wallet },
  { href: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/settings", label: "Settings", icon: Settings },
];

// Navigation links for public routes (all users)
const publicNavLinks = [{ href: "/", label: "Home", icon: Home }];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Determine which nav links to show based on authentication status
  const navLinks = session ? protectedNavLinks : publicNavLinks;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-center">
      <div
        className={cn(
          "absolute inset-0 border-b border-white/10 backdrop-blur-md transition-colors duration-200",
          isScrolled
            ? "bg-white/5 border-b-2 border-white/10"
            : "bg-[#1ab57e] border-b-2 border-white/10"
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-white/5 pointer-events-none" />
      <div className="container relative flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] pl-2"
          >
            <Image
              src="/logo.png"
              alt="SpendIt"
              width={45}
              height={45}
              className="relative top-0 rounded-lg object-cover bg-white p-1"
            />
            <span
              className={cn(
                "text-2xl font-bold transition-colors duration-200",
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
            {status === "loading" ? (
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ) : session ? (
              <>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-200",
                      isScrolled
                        ? "bg-white/5 text-primary"
                        : "bg-white/10 text-white"
                    )}
                  >
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      {session.user?.image ? (
                        <>
                          <Skeleton className="h-full w-full rounded-full absolute" />
                          <Image
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            fill
                            className="rounded-full object-cover"
                            onLoadingComplete={(img) => {
                              img.classList.remove("opacity-0");
                            }}
                            onError={(e) => {
                              e.currentTarget.src = "/fallback-avatar.png";
                            }}
                          />
                        </>
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium leading-none">
                        {session.user?.name?.split(" ")[0] || "User"}
                      </p>
                      <p
                        className={cn(
                          "text-xs leading-none mt-1",
                          isScrolled ? "text-primary/80" : "text-white/80"
                        )}
                      >
                        Welcome back!
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "relative group h-8 w-8",
                          isScrolled
                            ? "hover:bg-primary/10"
                            : "hover:bg-white/10"
                        )}
                      >
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                        <Settings
                          className={cn(
                            "h-4 w-4 transition-all",
                            isScrolled ? "text-primary" : "text-white",
                            "group-hover:rotate-90"
                          )}
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem className="flex items-center">
                        <span className="flex-1">New Features Available!</span>
                        <span className="h-2 w-2 bg-red-500 rounded-full" />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="text-red-600 focus:text-red-600"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() =>
                  signIn("lin", {
                    redirect: false,
                    callbackUrl: "/dashboard",
                  })
                }
                className={cn(
                  "transition-colors bg-transparent duration-200",
                  isScrolled
                    ? "border-primary text-primary hover:bg-primary/10"
                    : "border-white text-white hover:bg-white/10"
                )}
              >
                Sign In
              </Button>
            )}
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "relative group h-8 w-8",
                  isScrolled ? "hover:bg-primary/10" : "hover:bg-white/10"
                )}
              >
                <Menu
                  className={cn(
                    "h-4 w-4 transition-all",
                    isScrolled ? "text-primary" : "text-white"
                  )}
                />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src="/logo.png"
                    alt="SpendIt"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
                    SpendIt
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col py-2">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                      "hover:bg-primary/10",
                      pathname === item.href && "bg-primary/10 text-primary"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
                {status === "loading" ? (
                  <div className="flex items-center gap-3 px-4 py-4 mt-auto border-t">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ) : session ? (
                  <div className="mt-auto border-t">
                    <div className="flex items-center gap-3 p-4">
                      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        {session.user?.image ? (
                          <>
                            <Skeleton className="h-full w-full rounded-full absolute" />
                            <Image
                              src={session.user.image}
                              alt={session.user.name || "User"}
                              fill
                              className="rounded-full object-cover"
                              onLoadingComplete={(img) => {
                                img.classList.remove("opacity-0");
                              }}
                              onError={(e) => {
                                e.currentTarget.src = "/fallback-avatar.png";
                              }}
                            />
                          </>
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium leading-none">
                          {session.user?.name?.split(" ")[0] || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Welcome back!
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-red-600 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="mt-auto border-t p-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        signIn("linkedin", {
                          callbackUrl: "/dashboard",
                        });
                        setIsOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
