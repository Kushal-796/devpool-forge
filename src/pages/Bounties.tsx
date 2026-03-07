import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import BountyCard from "@/components/BountyCard";
import { bounties } from "@/data/mock-data";
import { Button } from "@/components/ui/button";

const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

const Bounties = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = bounties.filter((b) => {
    const matchDiff = filter === "All" || b.difficulty === filter;
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
    return matchDiff && matchSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Bounty Board</h1>
          <p className="text-muted-foreground">Solve challenges, earn points, and prove your expertise.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search bounties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-2">
            {difficulties.map((d) => (
              <Button
                key={d}
                size="sm"
                variant={filter === d ? "default" : "outline"}
                onClick={() => setFilter(d)}
                className={filter === d ? "bg-primary" : "border-border/30 text-muted-foreground hover:bg-muted/50"}
              >
                {d}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((bounty, i) => (
            <BountyCard key={bounty.id} {...bounty} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">No bounties found.</div>
        )}
      </div>
    </div>
  );
};

export default Bounties;
