"use client";

import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import AddTaskForm from "@/components/tasks/add-task-form";
import TaskList from "@/components/tasks/task-list";
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";

type FilterStatus = "all" | "active" | "completed";

const initialTasks: Task[] = [
  {
    id: uuidv4(),
    title: "Set up project structure",
    description: "Initialize Next.js app, install dependencies, and set up folder structure.",
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Design UI components",
    description: "Create reusable components for buttons, inputs, and cards using shadcn/ui.",
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Implement Task CRUD",
    description: "Develop functionality to create, read, update, and delete tasks.",
    completed: false,
  },
    {
    id: uuidv4(),
    title: "Integrate AI for prioritization",
    description: "Use GenAI to estimate task completion time and suggest reminders.",
    completed: false,
  },
];


export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      completed: false,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };
  
  const updateTask = (id: string, title: string, description: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title, description } : task
      )
    );
  };


  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "active":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <AddTaskForm onAddTask={addTask} />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-headline">Your Tasks</h2>
            <div className="flex items-center space-x-2">
                <Button variant={filter === 'all' ? 'default' : 'secondary'} size="sm" onClick={() => setFilter('all')}>All</Button>
                <Button variant={filter === 'active' ? 'default' : 'secondary'} size="sm" onClick={() => setFilter('active')}>Active</Button>
                <Button variant={filter === 'completed' ? 'default' : 'secondary'} size="sm" onClick={() => setFilter('completed')}>Completed</Button>
            </div>
        </div>
        <TaskList
          tasks={filteredTasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onUpdateTask={updateTask}
        />
      </div>
    </div>
  );
}
