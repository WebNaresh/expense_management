import { handleIncomingMessage as processAIMessage } from "@/lib/open_ai";
import { prisma } from "@/lib/prisma";
import { WhatsappMessageBuilder } from "@/lib/whatsapp_template_builder";
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



async function handleInteractiveResponse(senderNumber: string, interactionId: string) {
    console.log(`User ${senderNumber} clicked ${interactionId}`);

    try {
        switch (interactionId) {


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
