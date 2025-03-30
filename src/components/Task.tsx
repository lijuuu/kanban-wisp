
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Trash2, Clock } from "lucide-react";

export type TaskStatus = "todo" | "progress" | "done" | "forfeit";

export interface TaskProps {
  id: string;
  content: string;
  status: TaskStatus;
  startTime?: number;
  endTime?: number;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDelete: (id: string) => void;
}

const statusColorMap: Record<TaskStatus, string> = {
  todo: "bg-gray-500",
  progress: "bg-blue-500",
  done: "bg-green-500",
  forfeit: "bg-red-500",
};

const Task = ({ 
  id, 
  content, 
  status, 
  startTime, 
  endTime, 
  onDragStart, 
  onDelete 
}: TaskProps) => {
  const taskRef = useRef<HTMLDivElement>(null);

  // Calculate elapsed time
  const getElapsedTime = () => {
    if (!startTime) return null;
    
    const end = endTime || (status === "progress" ? Date.now() : null);
    if (!end) return null;
    
    const elapsedMs = end - startTime;
    const seconds = Math.floor((elapsedMs / 1000) % 60);
    const minutes = Math.floor((elapsedMs / (1000 * 60)) % 60);
    const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;
  };

  const elapsedTime = getElapsedTime();

  return (
    <div
      ref={taskRef}
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      className={cn(
        "task-card cursor-grab active:cursor-grabbing rounded px-3 py-2 mb-3 text-sm text-white flex justify-between items-center",
        statusColorMap[status]
      )}
      style={{ minWidth: "200px" }}
    >
      <div className="flex flex-col w-full">
        <span className="truncate">{content}</span>
        {elapsedTime && (
          <div className="flex items-center text-xs text-white/80 mt-1">
            <Clock size={12} className="mr-1" />
            <span>{elapsedTime}</span>
          </div>
        )}
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
        className="ml-2 text-white/70 hover:text-white"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default Task;
