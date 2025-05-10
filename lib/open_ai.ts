import { Task } from "@prisma/client";
import { OpenAI } from "openai";
import { prisma } from "./prisma";

export const openai = new OpenAI({
    apiKey: process.env.NEXT_OPEN_AI_API_KEY,
});

export const handleIncomingMessage = async (message: string, user_number: string) => {
    // First, use OpenAI to understand what the user wants to do
    // This removes the need for exact pattern matching and allows for natural, informal language
    const intentAnalysis = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a task management assistant that analyzes user messages.
                The user may write in informal language, with typos, grammatical errors, or slang.
                
                Analyze the message and determine what the user wants to do with their tasks.
                Your ONLY goal is to categorize the intent and extract relevant details.
                
                Respond with ONLY a JSON object with these fields:
                - intent: One of ["CREATE_TASK", "VIEW_TASKS", "VIEW_TODAYS_TASKS", "COMPLETE_TASK", "OTHER"]
                - details: An object with any of these fields as appropriate:
                  * task_name: The name of a task to create or complete
                  * task_position: Words like "first", "last", "1st" or ordinal references
                  * task_index: Any numerical task reference (e.g., "task 2" → 2)
                  * date: For tasks with dates, in ISO format if possible
                - confidence: A number from 0 to 1 indicating how confident you are in your interpretation
                
                Examples:
                "add task call mom" → {"intent": "CREATE_TASK", "details": {"task_name": "call mom"}, "confidence": 0.9}
                "pls rmind me to buy milk tmrw" → {"intent": "CREATE_TASK", "details": {"task_name": "buy milk", "date": "<tomorrow's date>"}, "confidence": 0.8}
                "1st one done" → {"intent": "COMPLETE_TASK", "details": {"task_position": "first"}, "confidence": 0.9}
                "wat i need 2 do 2day" → {"intent": "VIEW_TODAYS_TASKS", "details": {}, "confidence": 0.85}
                "done with calling doctor" → {"intent": "COMPLETE_TASK", "details": {"task_name": "calling doctor"}, "confidence": 0.9}`
            },
            { role: "user", content: message }
        ],
        response_format: { type: "json_object" }
    });

    try {
        // Parse the AI's interpretation
        const analysis = JSON.parse(intentAnalysis.choices[0].message.content || "{}");
        const intent = analysis.intent || "OTHER";
        const details = analysis.details || {};
        const confidence = analysis.confidence || 0;

        // Only process intents with reasonable confidence
        if (confidence < 0.6) {
            return generateGeneralResponse(message);
        }

        // Handle different intents
        switch (intent) {
            case "CREATE_TASK": {
                if (!details.task_name) {
                    return "I couldn't understand what task you'd like to add. Could you please try again?";
                }

                const taskName = details.task_name;
                let dueDate;

                try {
                    // Try to parse the due date from AI's response
                    dueDate = details.date ? new Date(details.date) : new Date();

                    // If date is invalid, use current date/time
                    if (isNaN(dueDate.getTime())) {
                        dueDate = new Date();
                    }
                } catch (_error) {
                    dueDate = new Date();
                }

                // Create the task
                await create_task(
                    taskName,
                    `Task created via WhatsApp: "${message}"`,
                    dueDate.toISOString(),
                    user_number
                );

                return `✅ Added: "${taskName}" for ${dueDate.toLocaleString('en-US', {
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
                    return "You don't have any tasks yet.";
                }

                // Group tasks by completion status
                const pendingTasks = tasks.filter(task => !task.isCompleted);
                const completedTasks = tasks.filter(task => task.isCompleted);

                // Format the response
                let response = "📋 Your Tasks:\n\n";

                if (pendingTasks.length > 0) {
                    response += "To Do:\n";
                    pendingTasks.forEach((task, i) => {
                        const dueDate = new Date(task.dueDate);
                        response += `${i + 1}. ${task.name} - Due: ${dueDate.toLocaleString('en-US', {
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
                    response += "Completed:\n";
                    completedTasks.slice(0, 3).forEach(task => { // Show only the 3 most recent completed tasks
                        response += `✓ ${task.name}\n`;
                    });

                    if (completedTasks.length > 3) {
                        response += `...and ${completedTasks.length - 3} more completed tasks\n`;
                    }
                }

                return response;
            }

            case "VIEW_TODAYS_TASKS": {
                // Get today's start and end date
                const today = new Date();
                const startOfDay = new Date(today.setHours(0, 0, 0, 0));
                const endOfDay = new Date(today.setHours(23, 59, 59, 999));

                // Retrieve user's tasks for today
                const todayTasks = await search_user_tasks_by_date(user_number, startOfDay, endOfDay);

                if (todayTasks.length === 0) {
                    return "You don't have any tasks for today.";
                }

                // Group tasks by completion status
                const pendingTasks = todayTasks.filter(task => !task.isCompleted);
                const completedTasks = todayTasks.filter(task => task.isCompleted);

                // Format the response
                let response = "📋 Today's Tasks:\n\n";

                if (pendingTasks.length > 0) {
                    response += "To Do:\n";
                    pendingTasks.forEach((task, i) => {
                        const dueDate = new Date(task.dueDate);
                        response += `${i + 1}. ${task.name} - Due: ${dueDate.toLocaleString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        })}\n`;
                    });
                }

                if (completedTasks.length > 0) {
                    if (pendingTasks.length > 0) response += "\n";
                    response += "Completed:\n";
                    completedTasks.forEach(task => {
                        response += `✓ ${task.name}\n`;
                    });
                }

                return response;
            }

            case "COMPLETE_TASK": {
                // Get the list of pending tasks
                const tasks = await search_user_tasks(user_number);
                const pendingTasks = tasks.filter(task => !task.isCompleted);

                if (pendingTasks.length === 0) {
                    return "You don't have any pending tasks to complete.";
                }

                // Variable to store the task to be completed
                let taskToComplete: Task | undefined;

                // Try to identify the task using multiple methods in order of specificity

                // 1. Try by position reference (first, second, last)
                if (details.task_position && !taskToComplete) {
                    const position = details.task_position.toLowerCase();

                    if (position.includes('first') || position.includes('1st')) {
                        taskToComplete = pendingTasks[0];
                    } else if (position.includes('second') || position.includes('2nd')) {
                        taskToComplete = pendingTasks[1];
                    } else if (position.includes('third') || position.includes('3rd')) {
                        taskToComplete = pendingTasks[2];
                    } else if (position.includes('fourth') || position.includes('4th')) {
                        taskToComplete = pendingTasks[3];
                    } else if (position.includes('fifth') || position.includes('5th')) {
                        taskToComplete = pendingTasks[4];
                    } else if (position.includes('last')) {
                        taskToComplete = pendingTasks[pendingTasks.length - 1];
                    }
                }

                // 2. Try by numerical index
                if (!taskToComplete && details.task_index) {
                    const index = parseInt(String(details.task_index)) - 1;
                    if (!isNaN(index) && index >= 0 && index < pendingTasks.length) {
                        taskToComplete = pendingTasks[index];
                    }
                }

                // 3. Try by name matching
                if (!taskToComplete && details.task_name) {
                    const taskName = details.task_name.toLowerCase();
                    taskToComplete = pendingTasks.find(task =>
                        task.name.toLowerCase().includes(taskName)
                    );
                }

                // 4. If only one task and no specific reference, assume they mean that task
                if (!taskToComplete && pendingTasks.length === 1) {
                    taskToComplete = pendingTasks[0];
                }

                // If no task found, ask for clarification
                if (!taskToComplete) {
                    let response = "I'm not sure which task you want to mark as done. Here are your tasks:\n\n";
                    pendingTasks.forEach((task, i) => {
                        response += `${i + 1}. ${task.name}\n`;
                    });
                    response += "\nYou can say something like \"first one done\" or \"completed call mom\".";
                    return response;
                }

                // Complete the task
                await complete_task(taskToComplete.id);

                return `✅ Marked as completed: "${taskToComplete.name}"`;
            }

            default:
                return generateGeneralResponse(message);
        }
    } catch (error) {
        console.error("Error processing message:", error);
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
                content: `You are a helpful WhatsApp assistant for an expense and task management app.
                When responding:
                1. Be concise and friendly
                2. The user may write in informal language with spelling/grammar errors, but respond naturally
                3. If the user seems to be trying to manage tasks, suggest commands like:
                   - "add task buy milk"
                   - "what are my tasks"
                   - "tasks for today"
                   - "mark first task done"
                4. Keep responses brief
                5. Sign off as "Expense Manager Bot"`
            },
            { role: "user", content: message }
        ],
    });

    return response.choices[0].message.content || "I'm not sure what you mean. Try asking about your tasks or expenses?";
}

// Task-related database functions
export const search_user_tasks = async (user_number: string) => {
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

export const search_user_tasks_by_date = async (user_number: string, startDate: Date, endDate: Date) => {
    const tasks = await prisma.task.findMany({
        where: {
            user: {
                whatsappNumber: user_number
            },
            dueDate: {
                gte: startDate,
                lte: endDate
            }
        },
        orderBy: {
            dueDate: 'asc'
        }
    });
    return tasks;
};

export const create_task = async (task_name: string, task_description: string, task_due_date: string, user_number: string) => {
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

export const complete_task = async (task_id: string) => {
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



