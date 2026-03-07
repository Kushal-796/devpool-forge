import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import DeveloperCard from "@/components/DeveloperCard";
import { developers } from "@/data/mock-data";

const Developers = () => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container mx-auto px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm text-primary mb-4">
          <Brain className="w-4 h-4" />AI Team Matching
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Ideal Teammates</h1>
        <p className="text-muted-foreground">AI-matched developers ranked by skill compatibility with your profile.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {developers.map((dev, i) => (
          <DeveloperCard key={dev.id} {...dev} index={i} />
        ))}
      </div>
    </div>
  </div>
);

export default Developers;
