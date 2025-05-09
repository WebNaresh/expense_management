"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  ArrowDownUp,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  PieChart,
  Plus,
  Shield,
  Smartphone,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const FeatureHighlight = ({ icon, title, description, color = "emerald" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeIn}
      className="flex gap-4 items-start"
    >
      <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600 mt-1`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("expenses");
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleGetStarted = async () => {
    console.log("Getting started");
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400 rounded-full filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Floating shapes */}
        <div className="absolute top-1/4 right-1/3 w-12 h-12 bg-white/10 rounded-lg rotate-12 animate-float"></div>
        <div
          className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-white/10 rounded-full -rotate-12 animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-8 h-8 bg-white/10 rounded-md rotate-45 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div
            ref={heroRef}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1 space-y-8">
              <motion.div variants={fadeIn} className="inline-block">
                <Badge
                  variant="default"
                  className="bg-emerald-400 text-emerald-950 hover:bg-emerald-400/90 px-4 py-1.5 shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 mr-1 animate-pulse" /> #1 Finance
                  Tracker in India
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
              >
                <span className="block">Smart Finance</span>
                <span className="block">
                  Tracking{" "}
                  <span className="text-emerald-200 relative inline-block">
                    Made Simple
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      viewBox="0 0 200 8"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 5.5C32 1.5 62 1.5 101 5.5C138 9.5 170 9.5 199 5.5"
                        stroke="#34d399"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  </span>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-xl md:text-2xl text-emerald-50 max-w-xl leading-relaxed"
              >
                Take control of your finances with our all-in-one solution for
                tracking expenses, managing subscriptions, and monitoring loans.
              </motion.p>

              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 pt-6"
              >
                <Button
                  className="bg-white text-black"
                  onClick={handleGetStarted}
                >
                  Get Started — It's Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="ghost">
                  See How It Works
                </Button>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="flex items-center gap-4 pt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-emerald-300 border-2 border-emerald-600 flex items-center justify-center text-xs font-bold text-emerald-800 shadow-md"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-100">
                    Joined by{" "}
                    <span className="font-bold text-white">10,000+</span> users
                    in the last month
                  </p>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                    <span className="ml-1 text-xs text-emerald-100">
                      4.9/5 rating
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={fadeIn}
              className="flex-1 relative"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-full max-w-md mx-auto">
                {/* Background decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-400/40 to-teal-300/40 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-emerald-400/40 to-blue-300/40 rounded-full blur-2xl"></div>

                {/* Main dashboard card with enhanced 3D effect */}
                <div className="relative bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 z-10 transform hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-2xl"></div>

                  {/* Top navigation bar */}
                  <div className="relative flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Bell className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                  {/* Dashboard content */}
                  <div className="relative space-y-4">
                    {/* Balance cards */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl text-white">
                        <p className="text-xs text-emerald-100">Balance</p>
                        <p className="text-lg font-bold">₹12,000</p>
                      </div>
                      <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl text-white">
                        <p className="text-xs text-red-100">To Pay</p>
                        <p className="text-lg font-bold">₹5,000</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl text-white">
                        <p className="text-xs text-blue-100">To Collect</p>
                        <p className="text-lg font-bold">₹7,000</p>
                      </div>
                    </div>

                    {/* Recent transactions */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <h3 className="text-sm font-semibold mb-3 text-gray-800">
                        Recent Transactions
                      </h3>
                      <div className="space-y-3">
                        {[
                          {
                            name: "Grocery Shopping",
                            amount: "-₹2,500",
                            icon: <Wallet className="w-4 h-4" />,
                            color: "text-emerald-600",
                          },
                          {
                            name: "Netflix Subscription",
                            amount: "-₹499",
                            icon: <CreditCard className="w-4 h-4" />,
                            color: "text-red-600",
                          },
                          {
                            name: "Salary Deposit",
                            amount: "+₹45,000",
                            icon: <DollarSign className="w-4 h-4" />,
                            color: "text-blue-600",
                          },
                        ].map((transaction, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${transaction.color}`}
                              >
                                {transaction.icon}
                              </div>
                              <span className="text-sm text-gray-600">
                                {transaction.name}
                              </span>
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                transaction.amount.startsWith("+")
                                  ? "text-green-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {transaction.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Button size="lg" className="w-[-webkit-available]">
                        <Plus className="w-4 h-4 mr-1" /> Add Expense
                      </Button>
                      <Button size="lg" className="w-[-webkit-available]">
                        <ArrowDownUp className="w-4 h-4 mr-1" /> Transfer
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -right-8 top-1/4 transform rotate-6 bg-white rounded-lg p-3 shadow-lg z-20 animate-float">
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-100 p-2 rounded-md">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap text-emerald-600">
                      Track Expenses
                    </span>
                  </div>
                </div>

                <div className="absolute -left-8 bottom-1/4 transform -rotate-6 bg-white rounded-lg p-3 shadow-lg z-20 animate-float delay-150">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <PieChart className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap text-blue-600">
                      Smart Analytics
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 160"
            className="w-full"
            preserveAspectRatio="none"
            style={{ marginBottom: -1 }}
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,128L1440,96L1440,160L0,160Z"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            ref={statsRef}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeIn}
              className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-emerald-50"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold mb-2">
                <CountUp end={10} suffix="M+" duration={2.5} enableScrollSpy />
              </h3>
              <p className="text-gray-600">Expenses tracked monthly</p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-emerald-50"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold mb-2">
                <CountUp end={100} suffix="%" duration={2.5} enableScrollSpy />
              </h3>
              <p className="text-gray-600">Data security & privacy</p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-emerald-50"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold mb-2">
                <CountUp end={50} suffix="K+" duration={2.5} enableScrollSpy />
              </h3>
              <p className="text-gray-600">Active users saving money</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* App Features Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4"
            >
              Powerful Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need to Manage Your Money
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SpendIt provides powerful tools to help you stay on top of your
              finances, avoid overspending, and make smarter financial
              decisions.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Tabs
              defaultValue="expenses"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-12">
                <TabsTrigger
                  value="expenses"
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Expense Tracking
                </TabsTrigger>
                <TabsTrigger
                  value="subscriptions"
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Subscription Management
                </TabsTrigger>
                <TabsTrigger
                  value="loans"
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
                >
                  <ArrowDownUp className="w-4 h-4 mr-2" />
                  Loan Tracking
                </TabsTrigger>
              </TabsList>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <TabsContent value="expenses" className="m-0">
                  <div className="grid md:grid-cols-2 gap-8 p-8">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold">
                        Track Every Rupee You Spend
                      </h3>
                      <p className="text-gray-600">
                        Keep track of all your expenses in one place. Categorize
                        spending, set budgets, and get insights into your
                        spending habits.
                      </p>

                      <div className="space-y-4 mt-8">
                        <FeatureHighlight
                          icon={<PieChart className="w-5 h-5" />}
                          title="Expense Categories"
                          description="Automatically categorize your expenses to see where your money goes"
                        />
                        <FeatureHighlight
                          icon={<Bell className="w-5 h-5" />}
                          title="Payment Reminders"
                          description="Get notified before bills are due to avoid late fees"
                        />
                        <FeatureHighlight
                          icon={<BarChart3 className="w-5 h-5" />}
                          title="Spending Analytics"
                          description="Visualize your spending patterns with intuitive charts and graphs"
                        />
                      </div>

                      <Button className="mt-6 bg-emerald-500 hover:bg-emerald-600">
                        Learn More About Expense Tracking
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl blur-lg opacity-20 -z-10"></div>
                      <div className="relative bg-white p-2 rounded-xl shadow-lg border border-emerald-100">
                        <Image
                          src="/financial_summary.png"
                          alt="SpendIt Expense Tracking"
                          width={600}
                          height={400}
                          className="rounded-lg w-full h-auto object-cover"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="subscriptions" className="m-0">
                  <div className="grid md:grid-cols-2 gap-8 p-8">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold">
                        Never Forget a Subscription Again
                      </h3>
                      <p className="text-gray-600">
                        Track all your recurring subscriptions in one place. Get
                        reminders before renewals and identify services you no
                        longer use.
                      </p>

                      <div className="space-y-4 mt-8">
                        <FeatureHighlight
                          icon={<Clock className="w-5 h-5" />}
                          title="Renewal Tracking"
                          description="Keep track of when your subscriptions renew to avoid unexpected charges"
                        />
                        <FeatureHighlight
                          icon={<Zap className="w-5 h-5" />}
                          title="Usage Analysis"
                          description="See which subscriptions you're actually using and which ones to cancel"
                        />
                        <FeatureHighlight
                          icon={<DollarSign className="w-5 h-5" />}
                          title="Cost Optimization"
                          description="Get suggestions for better plans or alternatives to save money"
                        />
                      </div>

                      <Button className="mt-6 bg-emerald-500 hover:bg-emerald-600">
                        Learn More About Subscription Management
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl blur-lg opacity-20 -z-10"></div>
                      <div className="relative bg-white p-2 rounded-xl shadow-lg border border-emerald-100">
                        <Image
                          src="/subscription_management.png"
                          alt="SpendIt Subscription Management"
                          width={600}
                          height={400}
                          className="rounded-lg w-full h-auto object-cover"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="loans" className="m-0">
                  <div className="grid md:grid-cols-2 gap-8 p-8">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold">
                        Manage Personal Loans with Ease
                      </h3>
                      <p className="text-gray-600">
                        Keep track of money you've borrowed or lent to friends
                        and family. Set payment schedules and get reminders.
                      </p>

                      <div className="space-y-4 mt-8">
                        <FeatureHighlight
                          icon={<ArrowDownUp className="w-5 h-5" />}
                          title="Loan Tracking"
                          description="Track both money you've borrowed and money you've lent to others"
                        />
                        <FeatureHighlight
                          icon={<Bell className="w-5 h-5" />}
                          title="Payment Reminders"
                          description="Get notified when loan payments are due or expected"
                        />
                        <FeatureHighlight
                          icon={<CheckCircle2 className="w-5 h-5" />}
                          title="Payment History"
                          description="Keep a complete record of all loan payments made and received"
                        />
                      </div>

                      <Button className="mt-6 bg-emerald-500 hover:bg-emerald-600">
                        Learn More About Loan Tracking
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl blur-lg opacity-20 -z-10"></div>
                      <div className="relative bg-white p-2 rounded-xl shadow-lg border border-emerald-100">
                        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="text-center p-6">
                            <BarChart3 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                            <p className="text-gray-600">
                              Loan tracking visualization
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4"
            >
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How SpendIt Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started with SpendIt is easy. Follow these simple steps to
              take control of your finances.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting line */}
            <div className="absolute top-24 left-1/2 h-[calc(100%-120px)] w-1 bg-emerald-100 -translate-x-1/2 hidden md:block"></div>

            <motion.div
              ref={featuresRef}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-12 relative z-10"
            >
              <motion.div
                variants={fadeIn}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl font-bold mb-4 border-4 border-white shadow-md">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Add Your Expenses</h3>
                <p className="text-gray-600 mb-4">
                  Record your daily expenses, bills, and purchases to keep track
                  of where your money goes.
                </p>
                <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-100 w-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-emerald-100 p-2 rounded-md">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="ml-2 font-medium">Add Expense</span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                      Easy
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Simply tap the "Add Expense" button and enter the amount,
                    category, and date.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="flex flex-col items-center text-center md:mt-24"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl font-bold mb-4 border-4 border-white shadow-md">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Manage Subscriptions</h3>
                <p className="text-gray-600 mb-4">
                  Add your recurring subscriptions to monitor monthly spending
                  and avoid forgotten charges.
                </p>
                <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-100 w-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-md">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="ml-2 font-medium">Add Subscription</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      Simple
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Enter subscription details including billing cycle, amount,
                    and renewal date.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl font-bold mb-4 border-4 border-white shadow-md">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Track Loans</h3>
                <p className="text-gray-600 mb-4">
                  Keep records of money borrowed or lent to friends and family
                  with payment schedules.
                </p>
                <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-100 w-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-orange-100 p-2 rounded-md">
                        <ArrowDownUp className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="ml-2 font-medium">Add Loan</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                      Quick
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Record loan details, set payment schedules, and get
                    reminders for due dates.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile Experience */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <Badge
                variant="outline"
                className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4"
              >
                Mobile Experience
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Take SpendIt Wherever You Go
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Access your financial data anytime, anywhere with our
                mobile-friendly design. Track expenses on the go and stay on top
                of your finances.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Responsive Design</h3>
                    <p className="text-gray-600">
                      Works seamlessly on all devices - desktop, tablet, and
                      mobile
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Quick Add</h3>
                    <p className="text-gray-600">
                      Add expenses in seconds with our streamlined mobile
                      interface
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Mobile Notifications</h3>
                    <p className="text-gray-600">
                      Get alerts for upcoming bills, subscription renewals, and
                      loan payments
                    </p>
                  </div>
                </div>
              </div>

              <Button className="mt-8 bg-emerald-500 hover:bg-emerald-600">
                Try on Your Device
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="order-1 md:order-2 relative">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-300 rounded-full filter blur-3xl opacity-20"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur-lg opacity-20 -z-10 transform rotate-3"></div>
                <div className="relative bg-white p-3 rounded-3xl shadow-2xl border border-emerald-100 transform -rotate-3">
                  <div className="rounded-2xl overflow-hidden">
                    <Image
                      src="/desktop_app.png"
                      alt="SpendIt Mobile App"
                      width={600}
                      height={800}
                      className="rounded-2xl w-full h-auto object-cover"
                      priority
                    />
                  </div>
                </div>

                <div className="absolute top-1/4 -left-16 bg-white shadow-lg rounded-lg p-3 flex items-center gap-2 transform -rotate-6 z-20">
                  <div className="bg-emerald-100 p-1.5 rounded-md">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium">Track on the go!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4"
            >
              Common Questions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to the most common questions about SpendIt.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <FaqItem
                question="Is SpendIt free to use?"
                answer="Yes, SpendIt offers a free plan with all essential features for personal finance tracking. We also offer premium plans with advanced features for power users."
              />

              <FaqItem
                question="How secure is my financial data?"
                answer="We take security seriously. All your data is encrypted both in transit and at rest. We use bank-level security measures and never share your data with third parties without your explicit consent."
              />

              <FaqItem
                question="Can I export my financial data?"
                answer="Yes, you can export your data in various formats including CSV and PDF for your records or for use in other financial tools."
              />

              <FaqItem
                question="Does SpendIt connect to my bank account?"
                answer="Currently, SpendIt works as a manual tracking tool. Bank integration features are on our roadmap and will be available in future updates."
              />

              <FaqItem
                question="Is there a mobile app available?"
                answer="SpendIt is fully responsive and works great on mobile browsers. A dedicated mobile app for iOS and Android is currently in development."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to teal-700"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400 rounded-full filter blur-3xl opacity-20"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-emerald-50">
            Join thousands of users who are making smarter financial decisions
            with SpendIt.
          </p>
          <Button
            size="lg"
            className="bg-white text-emerald-600 hover:bg-emerald-50 font-medium group shadow-lg transform hover:translate-y-[-2px] transition-all"
            onClick={handleGetStarted}
          >
            Get Started — It's Free
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <p className="mt-4 text-sm text-emerald-100">
            No credit card required. Free forever.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-emerald-500 text-white p-2 rounded mr-2">
                  <Wallet className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-white">SpendIt</span>
              </div>
              <p className="text-gray-400 mb-4">
                The smart way to track your finances and make better financial
                decisions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>
              &copy; {new Date().getFullYear()} SpendIt. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeIn}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <button
        className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium text-lg">{question}</h3>
        <ChevronRight
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </motion.div>
  );
}

function TestimonialCard({ quote, name, title, rating }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeIn}
    >
      <Card className="hover:shadow-lg transition-all duration-300 hover:border-emerald-200 h-full">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="mb-4 text-emerald-500">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
            >
              <path
                d="M9.59 4.59A2 2 0 1 1 11 8H8.41a1 1 0 0 0-.7.29l-3.3 3.3a1 1 0 0 0 0 1.41l3.3 3.3a1 1 0 0 0 .7.3H11a2 2 0 1 1-1.41 3.41"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.59 4.59A2 2 0 1 1 21 8h-2.59a1 1 0 0 0-.7.29l-3.3 3.3a1 1 0 0 0 0 1.41l3.3 3.3a1 1 0 0 0 .7.3H21a2 2 0 1 1-1.41 3.41"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex mb-3">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}
          </div>

          <p className="text-gray-700 mb-6 italic flex-grow">{quote}</p>

          <div className="flex items-center mt-auto">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
              {name.charAt(0)}
            </div>
            <div className="ml-3">
              <h4 className="font-bold">{name}</h4>
              <p className="text-sm text-gray-500">{title}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
