"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Coin animation for the 404 visual
  const coinAnimation = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [0, -15, 0],
      rotate: [0, 10, 0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="container max-w-4xl">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Left side - Content */}
            <motion.div
              className="text-center md:text-left space-y-6"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <h1 className="text-7xl md:text-9xl font-bold text-emerald-500">
                  404
                </h1>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">
                  Page Not Found
                </h2>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-600 max-w-md mx-auto md:mx-0"
              >
                Oops! It seems like the financial page you're looking for has
                gone missing from our ledger.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  <Link href="/">
                    <Home className="mr-2 h-5 w-5" />
                    Back to Home
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-emerald-500 text-emerald-500 hover:bg-emerald-50"
                >
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Go Back
                  </Link>
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-8">
                <div className="relative max-w-md mx-auto md:mx-0">
                  <div className="flex items-center border-2 border-gray-200 rounded-full px-4 py-2 focus-within:border-emerald-500 transition-colors">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for something else..."
                      className="flex-grow ml-2 outline-none text-gray-700"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right side - Illustration */}
            <motion.div className="flex justify-center" variants={itemVariants}>
              <div className="relative">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl"></div>

                {/* Animated coins */}
                <motion.div
                  className="relative z-10"
                  initial="initial"
                  animate="animate"
                  variants={coinAnimation}
                >
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full opacity-20"></div>
                    <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <Image
                            src="/logo.png"
                            alt="SpendIt Logo"
                            width={80}
                            height={80}
                            className="drop-shadow-lg"
                          />
                        </div>
                        <div className="text-6xl font-bold text-emerald-500">
                          404
                        </div>
                        <div className="text-gray-500 mt-2">Page Not Found</div>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold border-4 border-white shadow-md">
                      ₹
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold border-2 border-white shadow-md">
                      ₹
                    </div>
                  </div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  className="absolute top-0 right-0 w-10 h-10 bg-emerald-100 rounded-lg rotate-12"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [12, 20, 12],
                    transition: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    },
                  }}
                />
                <motion.div
                  className="absolute bottom-10 left-0 w-8 h-8 bg-teal-100 rounded-full"
                  animate={{
                    y: [0, 10, 0],
                    transition: {
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    },
                  }}
                />
                <motion.div
                  className="absolute bottom-0 right-20 w-6 h-6 bg-emerald-200 rounded-md rotate-45"
                  animate={{
                    y: [0, -15, 0],
                    rotate: [45, 90, 45],
                    transition: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5,
                    },
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Helpful links */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              You might want to check these pages:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Dashboard", href: "/" },
                { name: "Features", href: "/#features" },
                { name: "How It Works", href: "/#how-it-works" },
                { name: "Support", href: "/#support" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                >
                  <span className="font-medium text-gray-700 hover:text-emerald-600">
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
