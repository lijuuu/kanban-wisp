
import { cn } from "@/lib/utils";
import Task, { TaskStatus, TaskPriority } from "./Task";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: { 
    id: string; 
    content: string; 
    status: TaskStatus;
    startTime?: number;
    endTime?: number;
    priority?: TaskPriority;
  }[];
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onAddTask?: () => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newContent: string) => void;
  onPriorityChange?: (id: string, priority: TaskPriority) => void;
}

const statusColorMap: Record<TaskStatus, string> = {
  todo: "border-gray-500",
  progress: "border-blue-500",
  done: "border-green-500",
  forfeit: "border-red-500",
};

const statusBgMap: Record<TaskStatus, string> = {
  todo: "from-gray-800/80 to-gray-900/90",
  progress: "from-blue-900/50 to-blue-950/70",
  done: "from-green-900/50 to-green-950/70",
  forfeit: "from-red-900/50 to-red-950/70",
};

const Column = ({
  title,
  status,
  tasks,
  onDragStart,
  onDragOver,
  onDrop,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onPriorityChange,
}: ColumnProps) => {
  const columnTasks = tasks.filter((task) => task.status === status);
  
  return (
    <Card
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
      className={cn(
        "kanban-column flex flex-col p-4 glassmorphism border-t-4 h-full bg-gradient-to-b",
        statusColorMap[status],
        statusBgMap[status]
      )}
    >
      <CardHeader className="px-3 py-3 space-y-0 rounded-t-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white text-lg tracking-tight">{title}</h3>
            <span className="task-counter">{columnTasks.length}</span>
          </div>
          {status === "todo" && onAddTask && (
            <Button
              onClick={onAddTask}
              variant="ghost"
              size="sm"
              className="px-1 hover:bg-gray-800/50 rounded-full h-8 w-8 flex items-center justify-center"
              aria-label="Add new task"
            >
              <PlusCircle className="h-5 w-5 text-white/80 hover:text-white" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 px-2 pt-2 overflow-y-auto scrollbar-none">
        <div className="space-y-4">
          {columnTasks.map((task) => (
            <Task
              key={task.id}
              id={task.id}
              content={task.content}
              status={task.status}
              startTime={task.startTime}
              endTime={task.endTime}
              priority={task.priority}
              onDragStart={onDragStart}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
              onPriorityChange={status === "todo" ? onPriorityChange : undefined}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Column;
