import axios from 'axios';

export interface MediaMessage {
    type: 'image' | 'video' | 'document';
    url: string;
    caption?: string;
    filename?: string; // For documents
}

export class WhatsappMessageBuilder {
    private body: any;

    constructor(receiverNumber: string) {
        // Ensure the receiver number format is correct
        const formattedNumber = receiverNumber.startsWith('91')
            ? receiverNumber
            : `91${receiverNumber}`;

        // Initialize the body with required fields
        this.body = {
            messaging_product: 'whatsapp',
            to: formattedNumber,
            // Type will be set when a specific message type is added
        };
    }

    /**
     * Add a simple text message
     */
    setText(text: string): WhatsappMessageBuilder {
        this.body.type = 'text';
        this.body.text = {
            body: text
        };
        return this;
    }

    /**
     * Add a media message (image, video, document)
     */
    setMedia(media: MediaMessage): WhatsappMessageBuilder {
        this.body.type = media.type;

        // Set the appropriate media object
        this.body[media.type] = {
            link: media.url
        };

        // Add caption if provided
        if (media.caption) {
            this.body[media.type].caption = media.caption;
        }

        // Add filename for documents
        if (media.type === 'document' && media.filename) {
            this.body.document.filename = media.filename;
        }

        return this;
    }

    /**
     * Add a location message
     */
    setLocation(latitude: number, longitude: number, name?: string, address?: string): WhatsappMessageBuilder {
        this.body.type = 'location';
        this.body.location = {
            latitude,
            longitude
        };

        if (name) this.body.location.name = name;
        if (address) this.body.location.address = address;

        return this;
    }

    /**
     * Add an interactive message with reply buttons
     */
    setInteractiveButtons(header: string, body: string, buttons: { id: string, title: string }[]): WhatsappMessageBuilder {
        this.body.type = 'interactive';
        this.body.interactive = {
            type: 'button',
            header: {
                type: 'text',
                text: header
            },
            body: {
                text: body
            },
            action: {
                buttons: buttons.map(button => ({
                    type: 'reply',
                    reply: {
                        id: button.id,
                        title: button.title
                    }
                }))
            }
        };

        return this;
    }

    /**
     * Add an interactive message with a list
     */
    setInteractiveList(header: string, body: string, buttonText: string, sections: { title: string, rows: { id: string, title: string, description?: string }[] }[]): WhatsappMessageBuilder {
        this.body.type = 'interactive';
        this.body.interactive = {
            type: 'list',
            header: {
                type: 'text',
                text: header
            },
            body: {
                text: body
            },
            action: {
                button: buttonText,
                sections: sections.map(section => ({
                    title: section.title,
                    rows: section.rows.map(row => {
                        const rowObj: any = {
                            id: row.id,
                            title: row.title
                        };
                        if (row.description) rowObj.description = row.description;
                        return rowObj;
                    })
                }))
            }
        };

        return this;
    }

    build(): any {
        return this.body;
    }

    /**
     * Sends the WhatsApp message
     * @returns The WhatsApp API response data
     */
    async sendMessage(): Promise<any> {
        try {
            const phoneNumberId = process.env.NEXT_WHATSAPP_PHONE_NUMBER_ID;
            const accessToken = process.env.NEXT_WHATSAPP_API_ACCESS_TOKEN;

            if (!phoneNumberId || !accessToken) {
                throw new Error('Missing WhatsApp API credentials in environment variables');
            }

            const response = await axios.post(
                `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
                this.build(),
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('WhatsApp message sent successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw error;
        }
    }
}

// Example usage:
/*
// Send a simple text message
const textMessage = new WhatsappMessageBuilder('9370928324')
    .setText('Hello! This is a test message from the expense management app.')
    .sendMessage();

// Send an image
const imageMessage = new WhatsappMessageBuilder('9370928324')
    .setMedia({
        type: 'image',
        url: 'https://example.com/image.jpg',
        caption: 'Your expense summary chart'
    })
    .sendMessage();

// Send an interactive message with buttons
const buttonMessage = new WhatsappMessageBuilder('9370928324')
    .setInteractiveButtons(
        'Expense Alert',
        'Your Netflix subscription payment is due tomorrow. Would you like to pay now?',
        [
            { id: 'pay_now', title: 'Pay Now' },
            { id: 'remind_later', title: 'Remind Me Later' }
        ]
    )
    .sendMessage();
*/
