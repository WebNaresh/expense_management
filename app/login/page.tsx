"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  // call back is present redirect to callback
  useEffect(() => {
    if (callbackUrl) {
      router.push(callbackUrl);
    }
  }, [callbackUrl]);
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-gray-200 shadow-lg">
              <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/logo.png"
                    alt="SpendIt Logo"
                    width={60}
                    height={60}
                    className="drop-shadow-md"
                  />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Welcome to SpendIt
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Sign in to manage your finances with ease
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                  <p className="text-sm text-emerald-700 text-center">
                    SpendIt currently only supports sign in with Google
                  </p>
                </div>

                <Button
                  onClick={() => signIn("google", { callbackUrl })}
                  className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 font-medium border border-gray-300 shadow-sm"
                >
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      width="48px"
                      height="48px"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </div>
                </Button>
              </CardContent>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  variant="outline"
                  className="w-full border-emerald-500 text-emerald-500 hover:bg-emerald-50"
                  asChild
                >
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>

                <p className="text-xs text-center text-gray-500 px-6">
                  By signing in, you agree to our{" "}
                  <Link
                    href="#"
                    className="underline text-emerald-600 hover:text-emerald-800"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="underline text-emerald-600 hover:text-emerald-800"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </CardFooter>
            </Card>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="h-px bg-gray-300 w-12"></div>
                <p className="text-sm text-gray-500">Why Google Sign-In?</p>
                <div className="h-px bg-gray-300 w-12"></div>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-emerald-500 flex justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">Secure Authentication</p>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-emerald-500 flex justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">No Passwords</p>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-emerald-500 flex justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">Quick Access</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Decorative elements */}
      <div className="fixed -z-10 top-0 left-0 right-0 h-64 bg-gradient-to-b from-emerald-500/10 to-transparent"></div>
      <div className="fixed -z-10 bottom-0 left-0 w-full h-64 bg-gradient-to-t from-emerald-500/5 to-transparent"></div>
      <div className="fixed -z-10 top-1/4 -left-12 w-24 h-24 bg-emerald-300 rounded-full filter blur-3xl opacity-10"></div>
      <div className="fixed -z-10 bottom-1/3 -right-12 w-24 h-24 bg-emerald-400 rounded-full filter blur-3xl opacity-10"></div>
    </div>
  );
}
