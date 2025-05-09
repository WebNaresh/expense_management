import axios from "axios";

/**
 * Sends a test message to WhatsApp
 */
async function sendTestWhatsAppMessage(phoneNumber: string, message: string) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v17.0/${process.env.NEXT_WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "text",
                text: { body: message },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_WHATSAPP_API_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Test message sent successfully:", response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error sending test WhatsApp message:", error);
        return { success: false, error };
    }
}

export async function GET() {
    console.log(`⏱️ Cron job triggered at ${new Date().toISOString()}`);

    // Send a test message to the specified number
    const testNumber = "919370928324"; // Format with country code
    const testMessage = "Hello! This is a test message from the Expense Management app. - Naresh Bhosale AI";

    const result = await sendTestWhatsAppMessage(testNumber, testMessage);

    if (result.success) {
        return new Response('Cron job ran successfully and test message sent');
    } else {
        return new Response('Cron job ran but failed to send test message', { status: 500 });
    }
}
