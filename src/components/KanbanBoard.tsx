
import { useState, useEffect } from "react";
import Column from "./Column";
import { TaskStatus, TaskPriority } from "./Task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock } from "lucide-react";

interface Task {
  id: string;
  content: string;
  status: TaskStatus;
  startTime?: number;
  endTime?: number;
  priority?: TaskPriority;
}

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("medium");
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
    setNewTaskContent("");
    setNewTaskPriority("medium");
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEditTask = (id: string, newContent: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, content: newContent } : task
    ));
  };

  const handlePriorityChange = (id: string, priority: TaskPriority) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, priority } : task
    ));
  };

  const handleCreateTask = () => {
    if (newTaskContent.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        content: newTaskContent.trim(),
        status: "todo",
        priority: newTaskPriority,
      };
      
      setTasks([...tasks, newTask]);
      setNewTaskContent("");
      setNewTaskPriority("medium");
      setIsDialogOpen(false);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const forfeitedTasks = tasks.filter(t => t.status === "forfeit").length;
  const todoTasks = tasks.filter(t => t.status === "todo").length;
  const inProgressTasks = tasks.filter(t => t.status === "progress").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const inProgressTask = tasks.find(t => t.status === "progress");

  // Calculate elapsed time for in-progress task
  const getElapsedTime = (startTime?: number) => {
    if (!startTime) return "0m 0s";
    
    const elapsedMs = Date.now() - startTime;
    const seconds = Math.floor((elapsedMs / 1000) % 60);
    const minutes = Math.floor((elapsedMs / (1000 * 60)) % 60);
    const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;
  };

  return (
    <div className="p-4 bg-zinc-900 h-full">
      <Card className="bg-black/30 border-gray-800 mb-6 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Task Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-6">
              <div>
                <div className="text-sm text-gray-400">Total</div>
                <div className="text-2xl font-bold">{totalTasks}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Completed</div>
                <div className="text-2xl font-bold text-green-500">{completedTasks}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Forfeited</div>
                <div className="text-2xl font-bold text-red-500">{forfeitedTasks}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">To-Do</div>
                <div className="text-2xl font-bold text-gray-400">{todoTasks}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">In Progress</div>
                <div className="text-2xl font-bold text-blue-400">{inProgressTasks}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Completion Rate</div>
                <div className="text-2xl font-bold">{completionRate}%</div>
              </div>
            </div>
            
            {inProgressTask && (
              <div className="bg-blue-800/40 px-4 py-3 rounded-md border border-blue-700/50 w-full md:w-auto">
                <div className="text-sm text-blue-300 mb-1">Currently Working On:</div>
                <div className="font-medium text-white whitespace-pre-wrap break-words max-w-xl">{inProgressTask.content}</div>
                <div className="flex items-center text-xs text-blue-200 mt-2">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Time elapsed: {getElapsedTime(inProgressTask.startTime)}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          onPriorityChange={handlePriorityChange}
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
        <DialogContent className="sm:max-w-[500px] bg-zinc-900 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Task Description</label>
              <Textarea
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
                placeholder="Enter task description"
                className="bg-zinc-800 border-gray-700 text-white min-h-[120px]"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Priority</label>
              <Select value={newTaskPriority} onValueChange={(value: TaskPriority) => setNewTaskPriority(value)}>
                <SelectTrigger className="w-full bg-zinc-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-gray-700 text-white">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
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
