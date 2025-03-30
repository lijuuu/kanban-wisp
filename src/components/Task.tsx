
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export type TaskStatus = "todo" | "progress" | "done" | "forfeit";

export interface TaskProps {
  id: string;
  content: string;
  status: TaskStatus;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDelete: (id: string) => void;
}

const statusColorMap: Record<TaskStatus, string> = {
  todo: "bg-gray-500",
  progress: "bg-blue-500",
  done: "bg-green-500",
  forfeit: "bg-red-500",
};

const Task = ({ id, content, status, onDragStart, onDelete }: TaskProps) => {
  const taskRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={taskRef}
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      className={cn(
        "task-card cursor-grab active:cursor-grabbing rounded px-2 py-1 mb-2 text-xs text-white flex justify-between items-center",
        statusColorMap[status]
      )}
      style={{ height: "10px", minWidth: "50px" }}
    >
      <span className="truncate">{content}</span>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
        className="ml-1 text-white/70 hover:text-white"
      >
        <Trash2 size={10} />
      </button>
    </div>
  );
};

export default Task;
