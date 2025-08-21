"use client";

import { useState } from "react";
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Trash2, Loader2, Edit, Save, X } from "lucide-react";
import { getTaskEstimation } from "@/app/tasks/actions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";


interface TaskItemProps {
  task: Task;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, title: string, description: string) => void;
}

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
});

export default function TaskItem({ task, onToggleTask, onDeleteTask, onUpdateTask }: TaskItemProps) {
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimationResult, setEstimationResult] = useState<{ estimatedTime: string; reminderInstructions: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
    },
  });

  const handleEstimate = async () => {
    setIsEstimating(true);
    const result = await getTaskEstimation(task.description || task.title);
    setIsEstimating(false);
    if (result.success && result.data) {
      setEstimationResult(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "AI Estimation Failed",
        description: "Could not get an estimation for this task. Please try again.",
      });
    }
  };
  
  const handleUpdate = (values: z.infer<typeof formSchema>) => {
    onUpdateTask(task.id, values.title, values.description || "");
    setIsEditing(false);
  };

  return (
    <Card className={`transition-all duration-300 ${task.completed ? "bg-muted/50 border-dashed" : "bg-card"}`}>
      <CardHeader>
        <div className="flex items-start space-x-4">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => onToggleTask(task.id)}
            className="mt-1"
          />
          <div className="flex-1">
             {!isEditing ? (
              <>
                <CardTitle className={`font-body ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </CardTitle>
                {task.description && (
                  <CardDescription className={`mt-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.description}
                  </CardDescription>
                )}
              </>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-2">
                   <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                         <FormControl>
                          <Input {...field} className="text-lg font-semibold leading-none tracking-tight"/>
                         </FormControl>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                         <FormControl>
                          <Textarea {...field} className="text-sm text-muted-foreground" />
                         </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-end space-x-2">
        {isEditing ? (
          <>
            <Button variant="ghost" size="icon" onClick={() => form.handleSubmit(handleUpdate)()}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={handleEstimate} disabled={isEstimating || task.completed}>
              {isEstimating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="mr-2 h-4 w-4" />
              )}
              AI Estimate
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} disabled={task.completed}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>

      {estimationResult && (
        <AlertDialog open={!!estimationResult} onOpenChange={() => setEstimationResult(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-headline flex items-center">
                <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
                AI Task Estimation
              </AlertDialogTitle>
              <AlertDialogDescription>
                Here is the AI's estimation for completing: <span className="font-semibold text-foreground">{task.title}</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <h4 className="font-semibold">Estimated Time:</h4>
                <p className="text-accent font-bold text-lg">{estimationResult.estimatedTime}</p>
              </div>
              <div>
                <h4 className="font-semibold">Reminder Suggestion:</h4>
                <p>{estimationResult.reminderInstructions}</p>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setEstimationResult(null)}>Got it!</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
}
