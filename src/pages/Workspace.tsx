import { motion } from "framer-motion";
import { Send, Bot } from "lucide-react";
import { workspaceTasks, chatMessages } from "@/data/mock-data";
import { Button } from "@/components/ui/button";

const statusColumns = [
  { key: "todo" as const, label: "To Do", color: "bg-muted-foreground" },
  { key: "in-progress" as const, label: "In Progress", color: "bg-primary" },
  { key: "done" as const, label: "Done", color: "bg-secondary" },
];

const priorityColors = {
  high: "bg-destructive/20 text-destructive",
  medium: "bg-primary/20 text-primary",
  low: "bg-muted text-muted-foreground",
};

const Workspace = () => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container mx-auto px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Team Workspace</h1>
        <p className="text-muted-foreground">AI Code Review Assistant — Sprint 3</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Kanban */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statusColumns.map((col) => {
              const tasks = workspaceTasks.filter((t) => t.status === col.key);
              return (
                <motion.div
                  key={col.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <h3 className="text-sm font-semibold">{col.label}</h3>
                    <span className="text-xs text-muted-foreground ml-auto">{tasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <motion.div
                        key={task.id}
                        whileHover={{ y: -2 }}
                        className="glass-hover rounded-lg p-3 cursor-default"
                      >
                        <p className="text-sm font-medium mb-2">{task.title}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-[10px] font-bold">
                            {task.assignee}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Chat */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl flex flex-col h-[500px]">
          <div className="p-4 border-b border-border/30 flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Team Chat</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {msg.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold">{msg.user}</span>
                    <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border/30">
            <div className="flex gap-2">
              <input
                placeholder="Type a message..."
                className="flex-1 h-8 px-3 rounded-lg bg-muted/50 border border-border/30 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <Button size="sm" className="bg-primary hover:bg-primary/90 h-8 w-8 p-0">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

export default Workspace;
