
import { cn } from "@/lib/utils";
import Task, { TaskStatus } from "./Task";
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
  }[];
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onAddTask?: () => void;
  onDeleteTask: (id: string) => void;
}

const statusColorMap: Record<TaskStatus, string> = {
  todo: "border-gray-500",
  progress: "border-blue-500",
  done: "border-green-500",
  forfeit: "border-red-500",
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
}: ColumnProps) => {
  const columnTasks = tasks.filter((task) => task.status === status);
  
  return (
    <Card
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
      className={cn(
        "kanban-column flex flex-col p-2 bg-black border-t-4 h-full",
        statusColorMap[status]
      )}
    >
      <CardHeader className="px-3 py-2 space-y-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white text-sm">{title}</h3>
            <div className="text-xs text-white/60 mt-1">
              {columnTasks.length} {columnTasks.length === 1 ? "task" : "tasks"}
            </div>
          </div>
          {status === "todo" && onAddTask && (
            <Button
              onClick={onAddTask}
              variant="ghost"
              size="sm"
              className="px-1 hover:bg-transparent"
            >
              <PlusCircle className="h-5 w-5 text-white/70 hover:text-white" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 px-2 pt-0">
        {columnTasks.map((task) => (
          <Task
            key={task.id}
            id={task.id}
            content={task.content}
            status={task.status}
            startTime={task.startTime}
            endTime={task.endTime}
            onDragStart={onDragStart}
            onDelete={onDeleteTask}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default Column;
