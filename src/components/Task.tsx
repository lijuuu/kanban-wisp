
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Trash2, Clock, Edit2, Flag, FlagOff, ArrowUp, ArrowDown } from "lucide-react";

export type TaskStatus = "todo" | "progress" | "done" | "forfeit";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskProps {
  id: string;
  content: string;
  status: TaskStatus;
  startTime?: number;
  endTime?: number;
  priority?: TaskPriority;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newContent: string) => void;
  onPriorityChange?: (id: string, priority: TaskPriority) => void;
}

const statusColorMap: Record<TaskStatus, string> = {
  todo: "bg-gray-700",
  progress: "bg-blue-700",
  done: "bg-green-700",
  forfeit: "bg-red-700",
};

const priorityColorMap: Record<TaskPriority, string> = {
  low: "bg-green-500/20 text-green-400 border-green-500/40",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  high: "bg-red-500/20 text-red-400 border-red-500/40",
};

const priorityIconMap: Record<TaskPriority, React.ReactNode> = {
  low: <ArrowDown className="w-3 h-3 mr-1" />,
  medium: <Flag className="w-3 h-3 mr-1" />,
  high: <ArrowUp className="w-3 h-3 mr-1" />,
};

const Task = ({ 
  id, 
  content, 
  status, 
  startTime, 
  endTime, 
  priority = "medium", 
  onDragStart, 
  onDelete,
  onEdit,
  onPriorityChange
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

  const handlePriorityChange = () => {
    if (!onPriorityChange) return;
    
    const priorities: TaskPriority[] = ["low", "medium", "high"];
    const currentIndex = priorities.indexOf(priority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    onPriorityChange(id, priorities[nextIndex]);
  };

  return (
    <div
      ref={taskRef}
      draggable={!isEditing}
      onDragStart={(e) => !isEditing && onDragStart(e, id)}
      className={cn(
        "task-card cursor-grab active:cursor-grabbing rounded-lg px-3 py-3 mb-3 text-sm text-white flex flex-col shadow-lg",
        statusColorMap[status],
        isEditing && "cursor-default"
      )}
      style={{ width: "100%" }}
    >
      <div className="flex justify-between items-start w-full mb-2">
        {status === "todo" && onPriorityChange && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handlePriorityChange();
            }}
            className={cn(
              "text-xs py-1 px-2 rounded-full flex items-center mr-2",
              priorityColorMap[priority]
            )}
          >
            {priorityIconMap[priority]}
            {priority}
          </button>
        )}
        {status !== "todo" && priority && (
          <div className={cn(
            "text-xs py-1 px-2 rounded-full flex items-center border mr-2",
            priorityColorMap[priority]
          )}>
            {priorityIconMap[priority]}
            {priority}
          </div>
        )}
        <div className="flex items-center ml-auto">
          {!isEditing && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="ml-2 text-white/70 hover:text-white"
              aria-label="Edit task"
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
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col w-full">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleKeyDown}
            className="bg-black/20 border border-white/30 outline-none text-white w-full p-2 rounded-md min-h-[80px]"
            autoFocus
          />
        ) : (
          <div className="whitespace-pre-wrap break-words min-h-[50px]">{content}</div>
        )}
        {elapsedTime && (
          <div className="flex items-center text-xs text-white/80 mt-2">
            <Clock size={12} className="mr-1" />
            <span>{elapsedTime}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
