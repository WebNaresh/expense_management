import { openai, handleIncomingMessage as processAIMessage } from "@/lib/open_ai";
import { prisma } from "@/lib/prisma";
import { WhatsappMessageBuilder } from "@/lib/whatsapp_template_builder";
import { AppCurrency } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Message sending utilities
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

// Message handling functions
async function handleHelpCommand(senderNumber: string) {
    return sendInteractiveMessage(
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

async function handleSubscriptionCommand(senderNumber: string) {
    try {
        const subscriptions = await fetchUserSubscriptions(senderNumber);

        // Get user's name from the first subscription (if available)
        let userName = "there";
        if (subscriptions.length > 0 && subscriptions[0].user?.name) {
            userName = subscriptions[0].user.name;
        }

        // Generate subscription summary
        const subscriptionSummary = generateSubscriptionSummary(userName, subscriptions);
        console.log(`User ${senderNumber} requested subscriptions: ${JSON.stringify(subscriptions)}`);

        // Generate AI response
        const aiResponse = await generateAIResponse(userName, subscriptionSummary);
        return sendWhatsAppMessage(senderNumber, aiResponse || subscriptionSummary);
    } catch (error) {
        console.error('Error handling subscription command:', error);
        return sendWhatsAppMessage(senderNumber, "Sorry, I couldn't retrieve your subscriptions at the moment. Please try again later.");
    }
}

async function handleInteractiveResponse(senderNumber: string, interactionId: string) {
    console.log(`User ${senderNumber} clicked ${interactionId}`);

    try {
        switch (interactionId) {
            case 'view_subscriptions': {
                const subscriptions = await fetchUserSubscriptions(senderNumber);
                const subscriptionList = subscriptions.length > 0
                    ? subscriptions.map(sub => `- ${sub.name}: ${getCurrencySymbol(sub.currency)}${sub.amount} (renewal: ${new Date(sub.renewalDate).toLocaleDateString()})`).join('\n')
                    : 'You have no active subscriptions.';
                return sendWhatsAppMessage(senderNumber, `Your subscriptions:\n${subscriptionList}`);
            }

            case 'add_expense':
                return sendWhatsAppMessage(senderNumber, "To add an expense, please visit the app or reply with the expense details in this format: 'expense: [amount] for [description]'");

            case 'payment_reminder':
                return sendWhatsAppMessage(senderNumber, "I'll remind you before your subscription payments are due.");

            default:
                return sendWhatsAppMessage(senderNumber, `You selected: ${interactionId}`);
        }
    } catch (error) {
        console.error(`Error handling interactive response for ${interactionId}:`, error);
        return sendWhatsAppMessage(senderNumber, "Sorry, I couldn't process your request at the moment. Please try again later.");
    }
}

async function handleIncomingMessage(senderNumber: string, messageContent: string) {
    try {
        console.log(`Processing message from ${senderNumber}: ${messageContent}`);

        // Process the message using OpenAI integration in lib/open_ai.ts
        const aiResponse = await processAIMessage(messageContent, senderNumber);

        // Send the response back to the user
        return sendWhatsAppMessage(senderNumber, aiResponse);
    } catch (error) {
        console.error('Error handling message:', error);
        return sendWhatsAppMessage(senderNumber, "Sorry, I encountered an error processing your message. Please try again later.");
    }
}

// Helper functions
async function fetchUserSubscriptions(phoneNumber: string) {
    return prisma.subscription.findMany({
        where: {
            user: {
                whatsappNumber: phoneNumber
            }
        },
        select: {
            name: true,
            amount: true,
            renewalDate: true,
            currency: true,
            user: {
                select: {
                    name: true,
                    email: true,
                    whatsappNumber: true,
                }
            }
        }
    });
}

function getCurrencySymbol(currency: AppCurrency): string {
    const currencySymbols: Record<string, string> = {
        'INR': '₹',
        'USD': '$',
        'EUR': '€',
        'GBP': '£'
    };

    return currencySymbols[currency] || currency;
}

function generateSubscriptionSummary(userName: string, subscriptions: any[]) {
    if (subscriptions.length === 0) {
        return `Hi ${userName}! You don't have any active subscriptions yet.`;
    }

    // Group subscriptions by currency
    const subscriptionsByCurrency: Record<string, any[]> = {};
    subscriptions.forEach(sub => {
        const currency = sub.currency || 'INR';
        if (!subscriptionsByCurrency[currency]) {
            subscriptionsByCurrency[currency] = [];
        }
        subscriptionsByCurrency[currency].push(sub);
    });

    // Generate formatted lists and totals
    const formattedLists: string[] = [];
    const totalAmounts: string[] = [];

    Object.entries(subscriptionsByCurrency).forEach(([currency, subs]) => {
        const symbol = getCurrencySymbol(currency as AppCurrency);
        const totalAmount = subs.reduce((sum, sub) => sum + sub.amount, 0);

        const formattedList = subs.map(
            sub => `- ${sub.name}: ${symbol}${sub.amount} (renews on ${new Date(sub.renewalDate).toLocaleDateString()})`
        ).join('\n');

        formattedLists.push(formattedList);
        totalAmounts.push(`Total ${currency} spending: ${symbol}${totalAmount}`);
    });

    return `Hi ${userName}! Here are your active subscriptions:\n\n${formattedLists.join('\n\n')}\n\n${totalAmounts.join('\n')}`;
}

async function generateAIResponse(userName: string, subscriptionSummary: string) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful WhatsApp bot for an expense management app. 
                    When responding about subscriptions:
                    1. Be concise and friendly
                    2. Address the user by their name
                    3. Focus on providing information about the subscriptions
                    4. Maintain the correct currency symbols for each subscription (₹ for INR, $ for USD, etc.)
                    5. If there are multiple currencies, mention the total for each currency separately
                    6. If there are no subscriptions, suggest how to add one
                    7. Avoid phrases like "I'm an AI" or "As an AI"
                    8. Don't ask questions about what the user wants - just provide the subscription info
                    9. Sign off as "Expense Manager Bot"`
                },
                {
                    role: "user",
                    content: `A user named "${userName}" has asked about their subscriptions. Here is their subscription data: ${subscriptionSummary}. 
                    Please provide a helpful, concise response addressing them by name and maintaining the correct currency formats.`
                }
            ]
        });

        return response.choices[0].message.content || null;
    } catch (error) {
        console.error('Error generating AI response:', error);
        return null;
    }
}

// Webhook verification endpoint
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const mode = searchParams.get('hub.mode');
        const token = searchParams.get('hub.verify_token');
        const challenge = searchParams.get('hub.challenge');

        // Verify that all required parameters are present
        if (!mode || !token || !challenge) {
            return new NextResponse('Missing required parameters', { status: 400 });
        }

        // Verify the mode and token
        if (mode === 'subscribe' && token === "spendit123") {
            return new NextResponse(challenge, { status: 200 });
        } else {
            return new NextResponse('Forbidden', { status: 403 });
        }
    } catch (error) {
        console.error('Error in webhook verification:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// Webhook processing endpoint
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log(`Received webhook:`, JSON.stringify(body));

        // Validate webhook structure
        if (!body.object || !body.entry || !Array.isArray(body.entry)) {
            console.error('Invalid webhook format', body);
            return new NextResponse('Invalid webhook format', { status: 400 });
        }

        // Process each entry in the webhook
        await Promise.all(body.entry.map(async (entry: any) => {
            if (!entry.changes || !Array.isArray(entry.changes)) {
                return;
            }

            // Process changes in parallel
            await Promise.all(entry.changes.map(async (change: any) => {
                if (!change.value || !change.value.messages || !Array.isArray(change.value.messages)) {
                    return;
                }

                // Process messages in parallel
                await Promise.all(change.value.messages.map(async (message: any) => {
                    // Safety check for required fields
                    if (!message.from || (!message.text && !message.interactive)) {
                        return;
                    }

                    const senderNumber = message.from;
                    let messageContent = '';

                    // Extract message content based on type
                    if (message.text && message.text.body) {
                        messageContent = message.text.body;
                    } else if (message.interactive) {
                        if (message.interactive.button_reply) {
                            messageContent = `BUTTON:${message.interactive.button_reply.id}`;
                        } else if (message.interactive.list_reply) {
                            messageContent = `LIST:${message.interactive.list_reply.id}`;
                        }
                    }

                    try {
                        if (messageContent.startsWith('BUTTON:') || messageContent.startsWith('LIST:')) {
                            const interactionId = messageContent.split(':')[1];
                            await handleInteractiveResponse(senderNumber, interactionId);
                        } else {
                            const registered_user = await prisma.user.findUnique({
                                where: {
                                    whatsappNumber: senderNumber
                                }
                            });
                            if (registered_user) {
                                await handleIncomingMessage(senderNumber, messageContent);
                            }
                        }
                    } catch (error) {
                        console.error(`Error processing message from ${senderNumber}:`, error);
                    }
                }));
            }));
        }));

        // Return success response
        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        // Still return 200 to acknowledge receipt, even if processing failed
        return new NextResponse('OK', { status: 200 });
    }
}
