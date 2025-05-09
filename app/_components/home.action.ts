"use server";

import { prisma } from "@/lib/prisma";


export async function getSubscriptions() {
    const subscriptions = await prisma.subscription.findMany();
    return subscriptions;
}
