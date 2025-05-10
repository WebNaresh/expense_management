import { OpenAI } from "openai";
import { prisma } from "./prisma";
export const openai = new OpenAI({
    apiKey: process.env.NEXT_OPEN_AI_API_KEY,
});

export const handleIncomingMessage = async (message: string, user_number: string) => {
    // First, use OpenAI to understand the user's intent
    const intentAnalysis = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are an intent classifier for a WhatsApp bot that manages tasks and expenses.
                Analyze the user's message and output ONLY ONE of these intents:
                - CREATE_TASK: User wants to create a task (extract task_name and due_date)
                - VIEW_TASKS: User wants to see their tasks
                - OTHER: Any other query or conversation
                
                Format your response as a JSON object with these fields:
                - intent: The detected intent
                - task_name: (Only for CREATE_TASK) The name of the task
                - due_date: (Only for CREATE_TASK) The due date/time in ISO format
                - confidence: A number between 0 and 1 indicating your confidence`
            },
            { role: "user", content: message }
        ],
        response_format: { type: "json_object" }
    });

    try {
        // Parse the intent analysis response
        const intentData = JSON.parse(intentAnalysis.choices[0].message.content || "{}");
        const intent = intentData.intent || "OTHER";
        const confidence = intentData.confidence || 0;

        // Only process intents with reasonable confidence
        if (confidence < 0.6) {
            return generateGeneralResponse(message);
        }

        // Handle different intents
        switch (intent) {
            case "CREATE_TASK": {
                if (!intentData.task_name) {
                    return "I couldn't understand the task details. Please specify what task you'd like to add.";
                }

                const taskName = intentData.task_name;
                let dueDate;

                try {
                    // Try to parse the due date from AI's response
                    dueDate = intentData.due_date ? new Date(intentData.due_date) : new Date();

                    // If date is invalid, use current date/time
                    if (isNaN(dueDate.getTime())) {
                        dueDate = new Date();
                    }
                } catch (error) {
                    dueDate = new Date();
                }

                // Create the task
                await create_task(
                    taskName,
                    `Task created via WhatsApp message: "${message}"`,
                    dueDate.toISOString(),
                    user_number
                );

                return `✅ Task created: "${taskName}" scheduled for ${dueDate.toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                })}`;
            }

            case "VIEW_TASKS": {
                // Retrieve user's tasks
                const tasks = await search_user_tasks(user_number);

                if (tasks.length === 0) {
                    return "You don't have any tasks scheduled at the moment.";
                }

                // Group tasks by completion status
                const pendingTasks = tasks.filter(task => !task.isCompleted);
                const completedTasks = tasks.filter(task => task.isCompleted);

                // Format the response
                let response = "📋 Your Tasks:\n\n";

                if (pendingTasks.length > 0) {
                    response += "Pending Tasks:\n";
                    pendingTasks.forEach((task, index) => {
                        const dueDate = new Date(task.dueDate);
                        response += `${index + 1}. ${task.name} - Due: ${dueDate.toLocaleString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        })}\n`;
                    });
                }

                if (completedTasks.length > 0) {
                    if (pendingTasks.length > 0) response += "\n";
                    response += "Completed Tasks:\n";
                    completedTasks.slice(0, 3).forEach((task, index) => { // Show only the 3 most recent completed tasks
                        response += `✓ ${task.name}\n`;
                    });

                    if (completedTasks.length > 3) {
                        response += `...and ${completedTasks.length - 3} more completed tasks\n`;
                    }
                }

                return response;
            }

            default:
                return generateGeneralResponse(message);
        }
    } catch (error) {
        console.error("Error processing intent:", error);
        return generateGeneralResponse(message);
    }
};

// Generate a general response for messages that don't match specific intents
async function generateGeneralResponse(message: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a helpful WhatsApp assistant for an expense management app that can also handle tasks.
                When responding:
                1. Be concise and friendly
                2. If the user mentions tasks, remind them they can use phrases like "add task to call Vivek at 10am" or "tell me my tasks"
                3. If the user mentions expenses or subscriptions, be helpful about those features
                4. Keep responses brief and to the point
                5. Sign off as "Expense Manager Bot"`
            },
            { role: "user", content: message }
        ],
    });

    return response.choices[0].message.content || "I'm not sure how to respond to that. Can you try again?";
}

const search_user_tasks = async (user_number: string) => {
    const tasks = await prisma.task.findMany({
        where: {
            user: {
                whatsappNumber: user_number
            }
        },
        orderBy: {
            dueDate: 'asc'
        }
    });
    return tasks;
};


const create_task = async (task_name: string, task_description: string, task_due_date: string, user_number: string) => {
    const task = await prisma.task.create({
        data: {
            name: task_name,
            description: task_description,
            dueDate: new Date(task_due_date),
            user: {
                connect: {
                    whatsappNumber: user_number
                }
            }
        },
    });
    return task;
};

const update_task = async (task_id: string, task_name: string, task_description: string, task_due_date: string) => {
    const task = await prisma.task.update({
        where: {
            id: task_id
        },
        data: {
            name: task_name,
            description: task_description,
            dueDate: new Date(task_due_date),
        },
    });
    return task;
};

const complete_task = async (task_id: string) => {
    const task = await prisma.task.update({
        where: {
            id: task_id
        },
        data: {
            isCompleted: true
        },
    });
    return task;
};



