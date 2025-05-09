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
    let body;
    try {
        // Parse the request body only once
        body = await request.json();
        console.log(`🚀 ~ Received webhook:`, JSON.stringify(body));

        // WhatsApp webhook structure has 'object' and 'entry' at the top level
        if (!body.object || !body.entry || !Array.isArray(body.entry)) {
            console.error('Invalid webhook format', body);
            return new NextResponse('Invalid webhook format', { status: 400 });
        }

        // Process each message in the webhook
        for (const entry of body.entry) {
            if (!entry.changes || !Array.isArray(entry.changes)) {
                console.log('No changes in entry', entry);
                continue;
            }

            for (const change of entry.changes) {
                if (!change.value || !change.value.messages || !Array.isArray(change.value.messages)) {
                    console.log('No messages in change', change);
                    continue;
                }

                const value = change.value;

                // Process each message
                for (const message of value.messages) {
                    // Safety check for required fields
                    if (!message.from || (!message.text && !message.interactive)) {
                        console.log('Invalid message format', message);
                        continue;
                    }

                    const senderNumber = message.from;
                    let messageContent = '';

                    // Extract message content based on message type
                    if (message.text && message.text.body) {
                        messageContent = message.text.body;
                    } else if (message.interactive) {
                        // Handle interactive message responses
                        if (message.interactive.button_reply) {
                            messageContent = `BUTTON:${message.interactive.button_reply.id}`;
                        } else if (message.interactive.list_reply) {
                            messageContent = `LIST:${message.interactive.list_reply.id}`;
                        }
                    }

                    console.log(`Processing message from ${senderNumber}: ${messageContent}`);

                    try {
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
                            console.log(`User ${senderNumber} requested subscriptions: ${JSON.stringify(subscriptions)}`);

                            // Create a user-friendly subscription summary
                            let subscriptionSummary;
                            if (subscriptions.length === 0) {
                                subscriptionSummary = "You don't have any active subscriptions yet.";
                            } else {
                                const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
                                const formattedList = subscriptions.map(
                                    sub => `- ${sub.name}: ₹${sub.amount} (renews on ${new Date(sub.renewalDate).toLocaleDateString()})`
                                ).join('\n');

                                subscriptionSummary = `Here are your active subscriptions:\n\n${formattedList}\n\nTotal monthly spending: ₹${totalAmount}`;
                            }

                            // Improved OpenAI prompt with more guidance
                            const response = await openai.chat.completions.create({
                                model: "gpt-4o-mini",
                                messages: [
                                    {
                                        role: "system",
                                        content: `You are a helpful WhatsApp bot for an expense management app. 
                                        When responding about subscriptions:
                                        1. Be concise and friendly
                                        2. Focus on providing information about the subscriptions
                                        3. If there are subscriptions, mention when they're due and the total amount
                                        4. If there are no subscriptions, suggest how to add one
                                        5. Avoid phrases like "I'm an AI" or "As an AI"
                                        6. Don't ask questions about what the user wants - just provide the subscription info
                                        7. Sign off as "Expense Manager Bot"`
                                    },
                                    {
                                        role: "user",
                                        content: `A user has asked about their subscriptions. Here is their subscription data: ${subscriptionSummary}. 
                                        Please provide a helpful, concise response.`
                                    }
                                ]
                            });

                            await sendWhatsAppMessage(senderNumber, response.choices[0].message.content || subscriptionSummary);
                        } else if (messageContent.startsWith('BUTTON:') || messageContent.startsWith('LIST:')) {
                            // Handle interactive responses
                            const interactionId = messageContent.split(':')[1];
                            console.log(`User ${senderNumber} clicked ${interactionId}`);

                            if (interactionId === 'view_subscriptions') {
                                // Handle view subscriptions button
                                const subscriptionList = subscriptions.length > 0
                                    ? subscriptions.map(sub => `- ${sub.name}: ₹${sub.amount} (renewal: ${new Date(sub.renewalDate).toLocaleDateString()})`).join('\n')
                                    : 'You have no active subscriptions.';

                                await sendWhatsAppMessage(senderNumber, `Your subscriptions:\n${subscriptionList}`);
                            } else if (interactionId === 'add_expense') {
                                // Handle add expense button
                                await sendWhatsAppMessage(senderNumber, "To add an expense, please visit the app or reply with the expense details in this format: 'expense: [amount] for [description]'");
                            } else if (interactionId === 'payment_reminder') {
                                // Handle payment reminder button
                                await sendWhatsAppMessage(senderNumber, "I'll remind you before your subscription payments are due.");
                            } else {
                                await sendWhatsAppMessage(senderNumber, `You selected: ${interactionId}`);
                            }
                        } else {
                            // Handle the incoming message with the regular handler
                            await handleIncomingMessage(senderNumber, messageContent);
                        }
                    } catch (error) {
                        console.error(`Error processing message from ${senderNumber}:`, error);
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
