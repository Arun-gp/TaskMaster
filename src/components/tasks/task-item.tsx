"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Save, X, CalendarIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
    },
  });
  
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
                 <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    <CalendarIcon className="mr-1.5 h-4 w-4" />
                    <span>Created on {format(task.createdAt, "PPP")}</span>
                  </div>
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
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} disabled={task.completed}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
