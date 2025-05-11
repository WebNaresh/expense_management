"use server";

import { prisma } from "@/lib/prisma";

interface UpdateMobileNumberProps {
    userId: string;
    mobileNumber: string;
}

export async function updateMobileNumber({ userId, mobileNumber }: UpdateMobileNumberProps) {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                whatsappNumber: mobileNumber,
                whatsappVerified: true
            },
        });

        return { success: true, data: updatedUser };
    } catch (error) {
        console.error("Error updating mobile number:", error);
        return { success: false, error: "Failed to update mobile number" };
    }
}

export async function getUserTasks(userId: string) {
    try {
        // Get current date to filter today's tasks
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Fetch all user tasks
        const allTasks = await prisma.task.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                dueDate: 'asc'
            }
        });

        // Filter today's tasks
        const todayTasks = await prisma.task.findMany({
            where: {
                userId: userId,
                dueDate: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            orderBy: {
                dueDate: 'asc'
            }
        });

        // Get upcoming tasks (after today)
        const upcomingTasks = await prisma.task.findMany({
            where: {
                userId: userId,
                dueDate: {
                    gt: endOfDay
                },
                isCompleted: false
            },
            orderBy: {
                dueDate: 'asc'
            },
            take: 5 // Limit to 5 upcoming tasks
        });

        return {
            success: true,
            data: {
                all: allTasks,
                today: todayTasks,
                upcoming: upcomingTasks
            }
        };
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        return {
            success: false,
            error: "Failed to fetch tasks",
            data: {
                all: [],
                today: [],
                upcoming: []
            }
        };
    }
} 