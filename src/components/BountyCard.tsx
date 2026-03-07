import { motion } from "framer-motion";
import { Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BountyCardProps {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  points: number;
  techStack: string[];
  timeEstimate: string;
  submissions: number;
  index: number;
}

const difficultyColors = {
  Beginner: "bg-secondary/20 text-secondary",
  Intermediate: "bg-primary/20 text-primary",
  Advanced: "bg-destructive/20 text-destructive",
};

const BountyCard = ({ title, description, difficulty, points, techStack, timeEstimate, submissions, index }: BountyCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08 }}
    whileHover={{ y: -4 }}
    className="glass-hover rounded-xl p-6"
  >
    <div className="flex items-start justify-between mb-3">
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColors[difficulty]}`}>
        {difficulty}
      </span>
      <div className="flex items-center gap-1 text-secondary font-semibold text-sm">
        <Zap className="w-4 h-4" />
        {points} pts
      </div>
    </div>
    <h3 className="text-base font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
    <div className="flex flex-wrap gap-1.5 mb-4">
      {techStack.map((tech) => (
        <span key={tech} className="text-xs px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground">
          {tech}
        </span>
      ))}
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{timeEstimate}</span>
        <span>{submissions} submissions</span>
      </div>
      <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-xs h-8">
        Solve Challenge
      </Button>
    </div>
  </motion.div>
);

export default BountyCard;
