import { motion } from "framer-motion";
import { MapPin, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeveloperCardProps {
  name: string;
  avatar: string;
  title: string;
  skills: string[];
  compatibility: number;
  reputation: number;
  projects: number;
  location: string;
  index: number;
}

const DeveloperCard = ({ name, avatar, title, skills, compatibility, reputation, location, index }: DeveloperCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08 }}
    whileHover={{ y: -4 }}
    className="glass-hover rounded-xl p-6 text-center"
  >
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
      {avatar}
    </div>
    <h3 className="font-semibold">{name}</h3>
    <p className="text-sm text-muted-foreground mb-1">{title}</p>
    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-3">
      <MapPin className="w-3 h-3" />{location}
    </div>
    <div className="flex items-center justify-center gap-3 mb-4 text-xs">
      <span className="flex items-center gap-1 text-primary font-semibold">
        {compatibility}% match
      </span>
      <span className="flex items-center gap-1 text-muted-foreground">
        <Trophy className="w-3 h-3" />{reputation}
      </span>
    </div>
    <div className="flex flex-wrap justify-center gap-1.5 mb-4">
      {skills.slice(0, 3).map((skill) => (
        <span key={skill} className="text-xs px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground">
          {skill}
        </span>
      ))}
    </div>
    <Button size="sm" variant="outline" className="w-full text-xs h-8 border-primary/30 text-primary hover:bg-primary/10">
      Invite to Team
    </Button>
  </motion.div>
);

export default DeveloperCard;
