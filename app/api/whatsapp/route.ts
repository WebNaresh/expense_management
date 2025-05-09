import { openai } from "@/lib/open_ai";
import { prisma } from "@/lib/prisma";
import { WhatsappMessageBuilder } from "@/lib/whatsapp_template_builder";
import { NextRequest, NextResponse } from "next/server";

async function sendWhatsAppMessage(phoneNumber: string, message: string) {
    try {
        const messageBuilder = new WhatsappMessageBuilder(phoneNumber)
            .setText(message);

        const response = await messageBuilder.sendMessage();
        console.log("Message sent successfully:", response);
        return true;
    } catch (error) {
        console.error("Error sending WhatsApp message:", error);
        return false;
    }
}

/**
 * Sends an interactive message with buttons
 */
async function sendInteractiveMessage(phoneNumber: string, header: string, body: string, buttons: { id: string, title: string }[]) {
    try {
        const messageBuilder = new WhatsappMessageBuilder(phoneNumber)
            .setInteractiveButtons(header, body, buttons);

        const response = await messageBuilder.sendMessage();
        console.log("Interactive message sent successfully:", response);
        return true;
    } catch (error) {
        console.error("Error sending interactive WhatsApp message:", error);
        return false;
    }
}

/**
 * Handles incoming messages from WhatsApp
 */
async function handleIncomingMessage(senderNumber: string, messageContent: string) {
    try {
        // TODO: Implement your message handling logic here
        console.log(`Received message from ${senderNumber}: ${messageContent}`);

        // Check for specific commands
        if (messageContent.toLowerCase() === 'subscription') {
            // Send a response back for subscription command using the message builder
            await sendWhatsAppMessage(senderNumber, "I am Naresh Bhosale AI. How can I help you with your subscriptions?");
        } else if (messageContent.toLowerCase() === 'help') {
            // Send an interactive message with options
            await sendInteractiveMessage(
                senderNumber,
                "Expense Management Help",
                "How can I assist you today?",
                [
                    { id: "view_subscriptions", title: "View Subscriptions" },
                    { id: "add_expense", title: "Add Expense" },
                    { id: "payment_reminder", title: "Payment Reminders" }
                ]
            );
        }

        // Return true to indicate successful handling
        return true;
    } catch (error) {
        console.error('Error handling message:', error);
        return false;
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        console.log(`🚀 ~ searchParams:`, searchParams)
        const mode = searchParams.get('hub.mode');
        console.log(`🚀 ~ mode:`, mode)
        const token = searchParams.get('hub.verify_token');
        console.log(`🚀 ~ token:`, token)
        const challenge = searchParams.get('hub.challenge');
        console.log(`🚀 ~ challenge:`, challenge)

        // Verify that all required parameters are present
        if (!mode || !token || !challenge) {
            return new NextResponse('Missing required parameters', { status: 400 });
        }

        // Verify the mode and token
        if (mode === 'subscribe' && token === "spendit123") {
            // Respond with the challenge token from the request
            return new NextResponse(challenge, { status: 200 });
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            return new NextResponse('Forbidden', { status: 403 });
        }
    } catch (error) {
        console.error('Error in webhook verification:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

/**
 * POST endpoint for handling incoming webhook events
 * This endpoint receives messages and events from WhatsApp
 */
export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const body = await request.json();
        console.log(`🚀 ~ body:`, body.data.entry[0].changes[0].value.messages[0].text.body)

        console.log(`🚀 ~ JSON.stringify(body.data.entry):`, JSON.stringify(body.data.entry))

        // Validate the webhook payload against our schema



        // Process each message in the webhook
        for (const entry of body.data.entry) {
            for (const change of entry.changes) {
                const value = change.value;

                // Process each message
                for (const message of value.messages || []) {
                    const senderNumber = message.from;
                    const messageContent = message.text?.body || '';

                    const subscriptions = await prisma.subscription.findMany({
                        where: {
                            user: {
                                whatsappNumber: senderNumber
                            }
                        },
                        select: {
                            name: true,
                            amount: true,
                            renewalDate: true,
                        }
                    });

                    if (messageContent.toLowerCase() === 'subscription') {
                        console.log(`User ${senderNumber} said: Subscription ${JSON.stringify(subscriptions)} message: ${messageContent}`);
                        const response = await openai.chat.completions.create({
                            model: "gpt-4o-mini",
                            messages: [
                                { role: "user", content: `Act as whatsapp bot and reply to the user ${JSON.stringify(subscriptions)}` }
                            ]
                        });
                        await sendWhatsAppMessage(senderNumber, response.choices[0].message.content || 'No subscriptions found');
                    } else {
                        // Handle the incoming message
                        await handleIncomingMessage(senderNumber, messageContent);
                    }
                }
            }
        }

        // Return a 200 OK response quickly to acknowledge receipt
        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        // Still return 200 to acknowledge receipt, even if processing failed
        // This prevents WhatsApp from retrying the webhook unnecessarily
        return new NextResponse('OK', { status: 200 });
    }
}
