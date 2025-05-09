import { WhatsappMessageBuilder } from "@/lib/whatsapp_template_builder";

/**
 * Sends a test message to WhatsApp using the WhatsappMessageBuilder
 */
async function sendTestWhatsAppMessage(phoneNumber: string, message: string) {
    try {
        // Log environment variables (without exposing secrets)
        console.log("Phone Number ID available:", !!process.env.NEXT_WHATSAPP_PHONE_NUMBER_ID);
        console.log("API Token available:", !!process.env.NEXT_WHATSAPP_API_ACCESS_TOKEN);

        // Check if Phone Number ID looks like a phone number (which is incorrect)
        const phoneNumberId = process.env.NEXT_WHATSAPP_PHONE_NUMBER_ID || '';
        if (phoneNumberId.startsWith("91") || phoneNumberId.length < 10) {
            console.error("ERROR: Your Phone Number ID appears to be incorrect.");
            console.error("It should be a long ID number from Meta Developer Dashboard, not your actual phone number.");
            console.error("Example correct format: '107384765403322'");
            throw new Error("Invalid Phone Number ID format - check .env file");
        }

        console.log(`Creating WhatsApp message to ${phoneNumber}`);

        // Use the new WhatsappMessageBuilder
        const messageBuilder = new WhatsappMessageBuilder(phoneNumber)
            .setText(message);

        console.log("Request payload:", JSON.stringify(messageBuilder.build()));

        const response = await messageBuilder.sendMessage();

        console.log("Test message sent successfully:", response);
        return { success: true, data: response };
    } catch (error: any) {
        console.error("Error sending test WhatsApp message:", error);
        // Log more error details if available
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
        }
        return { success: false, error };
    }
}

/**
 * Send an interactive test message with buttons
 */
async function sendInteractiveTestMessage(phoneNumber: string) {
    try {
        console.log(`Creating interactive WhatsApp message to ${phoneNumber}`);

        const messageBuilder = new WhatsappMessageBuilder(phoneNumber)
            .setInteractiveButtons(
                "Expense Management",
                "Welcome to your expense management assistant! What would you like to do?",
                [
                    { id: "view_summary", title: "View Summary" },
                    { id: "upcoming_payments", title: "Upcoming Payments" }
                ]
            );

        console.log("Request payload:", JSON.stringify(messageBuilder.build()));

        const response = await messageBuilder.sendMessage();

        console.log("Interactive message sent successfully:", response);
        return { success: true, data: response };
    } catch (error: any) {
        console.error("Error sending interactive WhatsApp message:", error);
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
        }
        return { success: false, error };
    }
}

export async function GET() {
    console.log(`⏱️ Cron job triggered at ${new Date().toISOString()}`);

    // Send a test message to the specified number
    const testNumber = "919370928324"; // Format with country code
    const testMessage = "Hello! This is a test message from the Expense Management app. - Naresh Bhosale AI";

    console.log(`Attempting to send test messages to ${testNumber}`);

    // Send a regular text message
    const textResult = await sendTestWhatsAppMessage(testNumber, testMessage);

    // Send an interactive message with buttons
    const interactiveResult = await sendInteractiveTestMessage(testNumber);

    if (textResult.success && interactiveResult.success) {
        return new Response('Cron job ran successfully and all test messages sent');
    } else {
        return new Response(`Cron job ran but failed to send some test messages: ${textResult.error?.message || interactiveResult.error?.message || 'Unknown error'}`, { status: 500 });
    }
}
