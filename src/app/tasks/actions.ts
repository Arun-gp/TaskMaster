"use server";

import { aiTaskPrioritization, AiTaskPrioritizationOutput } from "@/ai/flows/ai-task-prioritization";

interface ActionResult {
    success: boolean;
    data?: AiTaskPrioritizationOutput;
    error?: string;
}

export async function getTaskEstimation(taskDescription: string): Promise<ActionResult> {
  if (!taskDescription) {
    return { success: false, error: "Task description cannot be empty." };
  }
  
  try {
    const result = await aiTaskPrioritization({ taskDescription });
    return { success: true, data: result };
  } catch (error) {
    console.error("AI Task Prioritization Error:", error);
    return { success: false, error: "An unexpected error occurred while getting the task estimation." };
  }
}
