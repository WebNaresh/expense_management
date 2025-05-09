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