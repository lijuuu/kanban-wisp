
import { useState, useEffect } from "react";
import Column from "./Column";
import { TaskStatus } from "./Task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Task {
  id: string;
  content: string;
  status: TaskStatus;
  startTime?: number;
  endTime?: number;
}

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", content: "Task 1", status: "todo" },
    { id: "2", content: "Task 2", status: "todo" },
    { id: "3", content: "Task 3", status: "progress", startTime: Date.now() - 600000 },
    { id: "4", content: "Task 4", status: "done", startTime: Date.now() - 3600000, endTime: Date.now() - 1800000 },
  ]);

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [timeNow, setTimeNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(Date.now());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    
    if (draggedTaskId) {
      const taskIndex = tasks.findIndex(t => t.id === draggedTaskId);
      
      if (taskIndex !== -1) {
        const updatedTasks = [...tasks];
        const task = updatedTasks[taskIndex];
        const oldStatus = task.status;
        
        if (oldStatus !== status) {
          if (status === "progress" && oldStatus !== "progress") {
            updatedTasks[taskIndex] = { 
              ...task, 
              status, 
              startTime: Date.now(),
              endTime: undefined
            };
          } else if ((status === "done" || status === "forfeit") && oldStatus === "progress") {
            updatedTasks[taskIndex] = { 
              ...task, 
              status, 
              endTime: Date.now() 
            };
          } else {
            updatedTasks[taskIndex] = { ...task, status };
          }
        }
        
        setTasks(updatedTasks);
      }
      
      setDraggedTaskId(null);
    }
  };

  const handleAddTask = () => {
    setIsDialogOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEditTask = (id: string, newContent: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, content: newContent } : task
    ));
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
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const inProgressTask = tasks.find(t => t.status === "progress");

  return (
    <div className="p-4 bg-black h-full">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Kanban Board</h2>
      
      <Card className="bg-black/30 border-gray-800 mb-6 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Task Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex space-x-6">
              <div>
                <div className="text-sm text-gray-400">Total</div>
                <div className="text-2xl font-bold">{totalTasks}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Completed</div>
                <div className="text-2xl font-bold text-green-500">{completedTasks}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Completion Rate</div>
                <div className="text-2xl font-bold">{completionRate}%</div>
              </div>
            </div>
            
            {inProgressTask && (
              <div className="bg-blue-500/20 px-4 py-2 rounded-md">
                <div className="text-sm text-blue-300">Currently Working On</div>
                <div className="font-medium">{inProgressTask.content}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Column
          title="Todo"
          status="todo"
          tasks={tasks}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
        <Column
          title="In Progress"
          status="progress"
          tasks={tasks}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
        <Column
          title="Done"
          status="done"
          tasks={tasks}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
        <Column
          title="Forfeit"
          status="forfeit"
          tasks={tasks}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <Input
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            placeholder="Enter task description"
            className="bg-gray-900 border-gray-700 text-white"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="bg-transparent text-white border-gray-700 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTask}
              className="bg-gray-500 hover:bg-gray-600 text-white"
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
