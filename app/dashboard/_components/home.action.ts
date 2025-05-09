"use server";

import { prisma } from "@/lib/prisma";
import { SubscriptionFormValues } from "./add-subscription-dialog";


export async function getSubscriptions() {
    const subscriptions = await prisma.subscription.findMany();
    return subscriptions;
}

export async function addSubscription(data: SubscriptionFormValues) {
    const subscription = await prisma.subscription.create({
        data: {
            name: data.name,
            amount: data.amount,
            renewalDate: data.renewalDate,
            currency: data.currency,
            hasVariableCharges: data.hasVariableCharges,
            isActive: data.isActive,
            // userId: data.userId,
        }
    });
    return subscription;
}

