import { motion } from "framer-motion";
import { MapPin, Github, Trophy, Star, Award, Calendar } from "lucide-react";
import { profileData } from "@/data/mock-data";

const Profile = () => {
  const p = profileData;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="glass rounded-xl p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                {p.avatar}
              </div>
              <h1 className="text-xl font-bold">{p.name}</h1>
              <p className="text-sm text-muted-foreground mb-1">{p.title}</p>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-4">
                <MapPin className="w-3 h-3" />{p.location}
              </div>
              <p className="text-sm text-muted-foreground mb-4">{p.bio}</p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-primary font-semibold"><Trophy className="w-4 h-4" />{p.reputation}</span>
                <span className="flex items-center gap-1 text-muted-foreground">Rank #{p.rank}</span>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Github className="w-4 h-4" />GitHub Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(p.githubStats).map(([key, val]) => (
                  <div key={key} className="text-center p-2 rounded-lg bg-muted/30">
                    <p className="text-lg font-bold">{val.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground capitalize">{key}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Award className="w-4 h-4" />Badges</h3>
              <div className="flex flex-wrap gap-2">
                {p.badges.map((badge) => (
                  <span key={badge} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
            {/* Skills */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Star className="w-4 h-4" />Skills</h3>
              <div className="space-y-3">
                {p.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" />Recent Activity</h3>
              <div className="space-y-4">
                {p.activity.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 pb-4 border-b border-border/20 last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{item.date}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
