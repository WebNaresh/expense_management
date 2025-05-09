"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 rounded-lg border p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-red-600">
          Authentication Error
        </h1>
        <p className="text-center text-gray-600">
          {error || "An error occurred during authentication"}
        </p>
        <Button asChild className="w-full">
          <Link href="/login">Try Again</Link>
        </Button>
      </div>
    </div>
  );
}
