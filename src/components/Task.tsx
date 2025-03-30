
import { useRef } from "react";
import { cn } from "@/lib/utils";

export type TaskStatus = "todo" | "progress" | "done" | "forfeit";

export interface TaskProps {
  id: string;
  content: string;
  status: TaskStatus;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

const statusColorMap: Record<TaskStatus, string> = {
  todo: "bg-kanban-todo",
  progress: "bg-kanban-progress",
  done: "bg-kanban-done",
  forfeit: "bg-kanban-forfeit",
};

const Task = ({ id, content, status, onDragStart }: TaskProps) => {
  const taskRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={taskRef}
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      className={cn(
        "task-card cursor-grab active:cursor-grabbing rounded px-2 py-1 mb-2 text-xs text-white",
        statusColorMap[status]
      )}
    >
      {content}
    </div>
  );
};

export default Task;
