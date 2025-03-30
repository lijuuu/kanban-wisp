
import { useState } from "react";
import Column from "./Column";
import { TaskStatus } from "./Task";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  content: string;
  status: TaskStatus;
}

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", content: "Task 1", status: "todo" },
    { id: "2", content: "Task 2", status: "todo" },
    { id: "3", content: "Task 3", status: "progress" },
    { id: "4", content: "Task 4", status: "done" },
  ]);

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    
    if (draggedTaskId) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === draggedTaskId) {
          return { ...task, status };
        }
        return task;
      });
      
      setTasks(updatedTasks);
      setDraggedTaskId(null);
      
      toast({
        title: "Task moved",
        description: `Task moved to ${status}`,
      });
    }
  };

  const handleAddTask = () => {
    setIsDialogOpen(true);
  };

  const handleCreateTask = () => {
    if (newTaskContent.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        content: newTaskContent.trim(),
        status: "todo",
      };
      
      setTasks([...tasks, newTask]);
      setNewTaskContent("");
      setIsDialogOpen(false);
      
      toast({
        title: "Task created",
        description: "New task added to Todo",
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Kanban Board</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Column
          title="Todo"
          status="todo"
          tasks={tasks}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onAddTask={handleAddTask}
        />
        <Column
          title="In Progress"
          status="progress"
          tasks={tasks}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
        <Column
          title="Done"
          status="done"
          tasks={tasks}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
        <Column
          title="Forfeit"
          status="forfeit"
          tasks={tasks}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      </div>

      {/* Dialog for adding new task */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#1E2433] text-white border-none">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <Input
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            placeholder="Enter task description"
            className="bg-[#25293A] border-[#3A3F4E] text-white"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="bg-transparent text-white border-white/30 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTask}
              className="bg-kanban-todo hover:bg-kanban-todo/90 text-white"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanBoard;
