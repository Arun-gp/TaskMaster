'use server';

/**
 * @fileOverview AI-powered task prioritization flow.
 *
 * - aiTaskPrioritization - A function that takes a task description and estimates the time required, then returns the estimated time and reminder instructions.
 * - AiTaskPrioritizationInput - The input type for the aiTaskPrioritization function.
 * - AiTaskPrioritizationOutput - The return type for the aiTaskPrioritization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiTaskPrioritizationInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('The description of the task for which to estimate time and set reminders.'),
});
export type AiTaskPrioritizationInput = z.infer<typeof AiTaskPrioritizationInputSchema>;

const AiTaskPrioritizationOutputSchema = z.object({
  estimatedTime: z
    .string()
    .describe('The estimated time required to complete the task (e.g., "2 hours", "30 minutes").'),
  reminderInstructions: z
    .string()
    .describe('Instructions for setting a reminder based on the estimated time (e.g., "Set a reminder for 1 hour before the estimated completion time.").'),
});
export type AiTaskPrioritizationOutput = z.infer<typeof AiTaskPrioritizationOutputSchema>;

export async function aiTaskPrioritization(input: AiTaskPrioritizationInput): Promise<AiTaskPrioritizationOutput> {
  return aiTaskPrioritizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTaskPrioritizationPrompt',
  input: {schema: AiTaskPrioritizationInputSchema},
  output: {schema: AiTaskPrioritizationOutputSchema},
  prompt: `You are a helpful AI assistant that estimates the time required for a task based on its description and provides instructions for setting reminders.

  Task Description: {{{taskDescription}}}

  Estimate the time required to complete the task and provide instructions for setting a reminder based on that estimate.
  The time should be an estimate like "2 hours" or "30 minutes".  The reminder instructions should be clear, like "Set a reminder for 1 hour before the estimated completion time.".`,
});

const aiTaskPrioritizationFlow = ai.defineFlow(
  {
    name: 'aiTaskPrioritizationFlow',
    inputSchema: AiTaskPrioritizationInputSchema,
    outputSchema: AiTaskPrioritizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
