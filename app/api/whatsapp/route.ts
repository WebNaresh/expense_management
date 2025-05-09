import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for incoming webhook messages
const webhookMessageSchema = z.object({
    object: z.string(),
    entry: z.array(
        z.object({
            id: z.string(),
            changes: z.array(
                z.object({
                    value: z.object({
                        messaging_product: z.string(),
                        metadata: z.object({
                            display_phone_number: z.string(),
                            phone_number_id: z.string(),
                        }),
                        contacts: z.array(
                            z.object({
                                profile: z.object({
                                    name: z.string(),
                                }),
                                wa_id: z.string(),
                            })
                        ),
                        messages: z.array(
                            z.object({
                                from: z.string(),
                                id: z.string(),
                                timestamp: z.string(),
                                text: z.object({
                                    body: z.string(),
                                }).optional(),
                                type: z.string(),
                            })
                        ),
                    }),
                    field: z.string(),
                })
            ),
        })
    ),
});

/**
 * Handles incoming messages from WhatsApp
 * This is a placeholder function that you can implement based on your needs
 */
async function handleIncomingMessage(senderNumber: string, messageContent: string) {
    try {
        // TODO: Implement your message handling logic here
        // For example:
        // - Parse expense amounts from messages
        // - Update user's expense records
        // - Send confirmation messages
        // - Integrate with your SpendIt application logic

        console.log(`Received message from ${senderNumber}: ${messageContent}`);

        // Return true to indicate successful handling
        return true;
    } catch (error) {
        console.error('Error handling message:', error);
        return false;
    }
}

/**
 * GET endpoint for webhook verification
 * This endpoint verifies the webhook URL when you set it up in the WhatsApp Business API
 */
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
        if (mode === 'subscribe' && token === process.env.NEXT_WHATSAPP_API_ACCESS_TOKEN) {
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

        // Validate the webhook payload against our schema
        const result = webhookMessageSchema.safeParse(body);

        if (!result.success) {
            console.error('Invalid webhook payload:', result.error);
            return new NextResponse('Invalid webhook payload', { status: 400 });
        }

        // Process each message in the webhook
        for (const entry of result.data.entry) {
            for (const change of entry.changes) {
                const value = change.value;

                // Process each message
                for (const message of value.messages || []) {
                    const senderNumber = message.from;
                    const messageContent = message.text?.body || '';

                    // Handle the incoming message
                    await handleIncomingMessage(senderNumber, messageContent);
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
