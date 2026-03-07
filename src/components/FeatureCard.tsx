import { motion } from "framer-motion";
import { Sparkles, Target, Users, Layout, Bot, Award, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Sparkles, Target, Users, Layout, Bot, Award,
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  index: number;
}

const FeatureCard = ({ title, description, icon, index }: FeatureCardProps) => {
  const Icon = iconMap[icon] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass-hover rounded-xl p-6 group cursor-default"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
