"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { LinkedinIcon, Share2Icon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { getUserTasks } from "./_components/profile.action";
import { TaskSection } from "./_components/task-section";
import { UpdateMobileDialog } from "./_components/update-mobile-dialog";
import DashboardLoader from "./loader";

// Sample data
const balanceData = {
  balance: 12000,
  change: 5.2,
};

const summaryData = {
  totalOwed: 5000,
  totalReceived: 7000,
};

const financialTrendData = [
  { date: "Apr 1", balance: 10000 },
  { date: "Apr 5", balance: 11200 },
  { date: "Apr 10", balance: 10800 },
  { date: "Apr 15", balance: 11500 },
  { date: "Apr 20", balance: 11000 },
  { date: "Apr 25", balance: 12500 },
  { date: "Apr 30", balance: 12000 },
];

const transactionsData = [
  {
    id: "1",
    date: "May 6, 2023",
    description: "Grocery Shopping",
    amount: 1500,
    category: "Food",
    status: "Paid" as const,
  },
  {
    id: "2",
    date: "May 5, 2023",
    description: "Uber Ride",
    amount: 350,
    category: "Transport",
    status: "Paid" as const,
  },
  {
    id: "3",
    date: "May 4, 2023",
    description: "Movie Tickets",
    amount: 800,
    category: "Entertainment",
    status: "Paid" as const,
  },
  {
    id: "4",
    date: "May 3, 2023",
    description: "Electricity Bill",
    amount: 1200,
    category: "Utilities",
    status: "Pending" as const,
  },
  {
    id: "5",
    date: "May 2, 2023",
    description: "Phone Bill",
    amount: 499,
    category: "Utilities",
    status: "Overdue" as const,
  },
];

export default function Dashboard() {
  const { data: session, status, update } = useSession();
  const [isSharing, setIsSharing] = useState(false);
  const [isWhatsappConnected, setIsWhatsappConnected] = useQueryState(
    "isWhatsappConnected",
    {
      defaultValue: false,
      parse: (value) => value === "true",
    }
  );

  // Use React Query to fetch tasks
  const { data: taskData, isLoading } = useQuery({
    queryKey: ["tasks", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const result = await getUserTasks(session.user.id);
      if (!result.success) {
        throw new Error("Failed to fetch tasks");
      }
      return result.data;
    },
    enabled: !!session?.user?.id,
  });

  if (status === "loading" || isLoading) {
    return <DashboardLoader />;
  }

  if (isWhatsappConnected) {
    if (session?.user) {
      setIsWhatsappConnected(false);
    }
  }

  // Handle successful mobile number update
  const handleMobileUpdate = async () => {
    // Refresh the session to get the updated user data
    await update();
  };

  // Function to share expense summary on LinkedIn
  const shareToLinkedin = async () => {
    if (!session?.user?.linkedinAccessToken) {
      toast.error("Please connect your LinkedIn account first");
      return;
    }

    setIsSharing(true);
    try {
      // Create a summary of expenses
      const expenseSummary = `I've been tracking my expenses with this amazing app! This month, I've spent ₹${balanceData.balance} with a ${balanceData.change}% change from last month.`;

      // Example of sharing a post to LinkedIn
      const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.linkedinAccessToken}`,
        },
        body: JSON.stringify({
          author: `urn:li:person:${session.user.id}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: expenseSummary,
              },
              shareMediaCategory: "NONE",
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        }),
      });

      if (response.ok) {
        toast.success("Successfully shared to LinkedIn!");
      } else {
        const error = await response.json();
        toast.error(`Failed to share: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sharing to LinkedIn:", error);
      toast.error("Failed to share to LinkedIn");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {!session?.user?.linkedinAccessToken ? (
            <Button onClick={() => signIn("linkedin")}>
              <LinkedinIcon className="mr-2 h-4 w-4" />
              <span>Connect with LinkedIn</span>
            </Button>
          ) : (
            <Button
              onClick={shareToLinkedin}
              disabled={isSharing}
              variant="outline"
            >
              <Share2Icon className="mr-2 h-4 w-4" />
              <span>{isSharing ? "Sharing..." : "Share Expense Summary"}</span>
            </Button>
          )}
          {session?.user && (
            <UpdateMobileDialog
              userId={session.user.id}
              currentNumber={session.user.whatsappNumber}
              onSuccess={handleMobileUpdate}
              initiallyOpen={!session.user.whatsappNumber}
            />
          )}
        </div>
      </div>

      {/* Task Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskSection
          todayTasks={taskData?.today ?? []}
          upcomingTasks={taskData?.upcoming ?? []}
        />

        {/* Additional dashboard cards can go here */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Summary</h2>
          <div className="space-y-4">
            <p>This is a placeholder for additional dashboard content.</p>
            <p className="text-sm text-gray-500">
              Add financial summaries, charts, or other information here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
