"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SubscriptionFormValues } from "./add-subscription-dialog";


export async function getSubscriptions() {
    const subscriptions = await prisma.subscription.findMany();
    return subscriptions;
}

export async function addSubscription(data: SubscriptionFormValues) {
    const user = await auth();
    if (!user?.user.id) {
        throw new Error("User is not authenticated");
    }
    const subscription = await prisma.subscription.create({
        data: {
            name: data.name,
            amount: data.amount,
            renewalDate: data.renewalDate,
            currency: data.currency,
            hasVariableCharges: data.hasVariableCharges,
            isActive: data.isActive,
            userId: user?.user.id,
        }
    });
    return subscription;
}

