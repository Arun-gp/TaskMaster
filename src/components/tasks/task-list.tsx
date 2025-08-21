"use client";

import { Task } from "@/lib/types";
import TaskItem from "./task-item";
import { Card, CardContent } from "../ui/card";

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, title: string, description: string) => void;
}

export default function TaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
  onUpdateTask
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
        <Card className="mt-4 text-center">
            <CardContent className="p-6">
                 <p className="text-muted-foreground">No tasks here. Add one above to get started!</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onUpdateTask={onUpdateTask}
        />
      ))}
    </div>
  );
}
