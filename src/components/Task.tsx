
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Trash2, Clock, Edit2 } from "lucide-react";

export type TaskStatus = "todo" | "progress" | "done" | "forfeit";

export interface TaskProps {
  id: string;
  content: string;
  status: TaskStatus;
  startTime?: number;
  endTime?: number;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newContent: string) => void;
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
  onDelete,
  onEdit
}: TaskProps) => {
  const taskRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

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

  const handleEditSubmit = () => {
    if (editedContent.trim()) {
      onEdit(id, editedContent);
    } else {
      setEditedContent(content); // Reset if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setEditedContent(content);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={taskRef}
      draggable={!isEditing}
      onDragStart={(e) => !isEditing && onDragStart(e, id)}
      className={cn(
        "task-card cursor-grab active:cursor-grabbing rounded px-3 py-2 mb-3 text-sm text-white flex justify-between items-center",
        statusColorMap[status],
        isEditing && "cursor-default"
      )}
      style={{ minWidth: "200px" }}
    >
      <div className="flex flex-col w-full">
        {isEditing ? (
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-b border-white/30 outline-none text-white w-full"
            autoFocus
          />
        ) : (
          <span className="truncate">{content}</span>
        )}
        {elapsedTime && (
          <div className="flex items-center text-xs text-white/80 mt-1">
            <Clock size={12} className="mr-1" />
            <span>{elapsedTime}</span>
          </div>
        )}
      </div>
      <div className="flex items-center">
        {!isEditing && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="ml-2 text-white/70 hover:text-white"
          >
            <Edit2 size={14} />
          </button>
        )}
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
    </div>
  );
};

export default Task;
