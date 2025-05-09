"use server";

import { prisma } from "@/lib/prisma";
import { SubscriptionFormValues } from "./add-subscription-dialog";


export async function getSubscriptions(userId: string) {
    console.log(`🚀 ~ userId:`, userId)
    const subscriptions = await prisma.subscription.findMany({
        where: {
            userId: userId,
        },
    });
    return subscriptions;
}

export async function addSubscription(data: SubscriptionFormValues) {
    console.log(`🚀 ~ data:`, data)

    const subscription = await prisma.subscription.create({
        data: {
            name: data.name,
            amount: data.amount,
            renewalDate: new Date(data.renewalDate),
            currency: data.currency,
            hasVariableCharges: data.hasVariableCharges,
            isActive: data.isActive,
            renewInterval: data.renewInterval,
            userId: data.userId,
        }
    });
    console.log(`🚀 ~ subscription:`, subscription)
    return subscription;
}

export async function deleteSubscription(id: string) {
    try {
        const deletedSubscription = await prisma.subscription.delete({
            where: {
                id: id
            }
        });
        return { success: true, data: deletedSubscription };
    } catch (error) {
        console.error("Error deleting subscription:", error);
        return { success: false, error: "Failed to delete subscription" };
    }
}

