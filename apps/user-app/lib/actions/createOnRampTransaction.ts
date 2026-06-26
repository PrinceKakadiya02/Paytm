"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/prisma/client";

export async  function createOnRampTransaction(amount: number, provider: string) {
    const session = await  getServerSession(authOptions);
    const token = Math.random().toString();
    if (!session?.user || !session.user?.id) {
        return {
            message: "Unauthenticated request"
        }
    }
    await prisma.onRampTransaction.create({
        data: {
            userId: Number(session?.user.id),
            amount: amount,
            status: "Processing",
            startTime: new Date(),
            provider,
            token
        }
    })

    return {
        message: "On Ramp Transaction added"
    }
}