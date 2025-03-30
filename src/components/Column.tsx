
import { cn } from "@/lib/utils";
import Task, { TaskStatus } from "./Task";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: { id: string; content: string; status: TaskStatus }[];
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
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
      className={cn(
        "kanban-column flex flex-col p-4 bg-black/80 rounded-md border-t-2",
        statusColorMap[status]
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-white">{title}</h3>
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
      
      <div className="flex-1">
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <Task
              key={task.id}
              id={task.id}
              content={task.content}
              status={task.status}
              onDragStart={onDragStart}
              onDelete={onDeleteTask}
            />
          ))}
      </div>
    </div>
  );
};

export default Column;
