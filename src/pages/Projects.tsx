import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { projects as mockProjects } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

const Projects = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const { firebaseUser, userProfile } = useAuthContext();
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState(mockProjects); // visible projects
  const [loadingProjects, setLoadingProjects] = useState(false);

  // fetch from firestore based on role
  useEffect(() => {
    const fetchDeveloperProjects = async () => {
      if (!firebaseUser) return;
      setLoadingProjects(true);
      try {
        const memQuery = query(
          collection(db, 'projectMembers'),
          where('userId', '==', firebaseUser.uid)
        );
        const memSnap = await getDocs(memQuery);
        const ids: string[] = [];
        memSnap.forEach(m => ids.push(m.data().projectId));
        if (ids.length === 0) {
          setProjectList([]);
          return;
        }
        const chunks: string[][] = [];
        while (ids.length) chunks.push(ids.splice(0, 10));
        const fetched: any[] = [];
        for (const chunk of chunks) {
          const pQuery = query(
            collection(db, 'projects'),
            where('__name__', 'in', chunk)
          );
          const pSnap = await getDocs(pQuery);
          pSnap.forEach(p => fetched.push({ id: p.id, ...p.data() }));
        }
        setProjectList(fetched);
      } catch (err) {
        console.error('Error loading developer projects', err);
        toast.error('Unable to load your projects');
      } finally {
        setLoadingProjects(false);
      }
    };

    if (userProfile?.role === 'developer') {
      fetchDeveloperProjects();
    } else if (userProfile?.role === 'owner' && firebaseUser) {
      // fetch projects owned by this user
      const fetchOwned = async () => {
        setLoadingProjects(true);
        try {
          const q = query(
            collection(db, 'projects'),
            where('ownerId', '==', firebaseUser.uid)
          );
          const snap = await getDocs(q);
          const own: any[] = [];
          snap.forEach(p => own.push({ id: p.id, ...p.data() }));
          setProjectList(own);
        } catch (err) {
          console.error('Error loading owner projects', err);
          toast.error('Unable to load your projects');
        } finally {
          setLoadingProjects(false);
        }
      };
      fetchOwned();
    } else {
      setProjectList(mockProjects);
    }
  }, [firebaseUser, userProfile]);

  const filtered = projectList.filter((p) => {
    const matchDiff = filter === "All" || p.difficulty === filter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.techStack.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchDiff && matchSearch;
  });

  const handleCreateProject = () => {
    if (!firebaseUser) {
      toast.error("Please log in to create a project");
      navigate("/login");
      return;
    }
    // TODO: Navigate to project creation form
    toast.info("Project creation form coming soon!");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Project Board</h1>
            <p className="text-muted-foreground">Find projects to contribute to and build your portfolio.</p>
          </div>
          {firebaseUser && (
            <Button onClick={handleCreateProject} className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects or tech stack..."
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

        {loadingProjects ? (
          <div className="text-center py-16">
            <span>Loading projects...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  techStack={project.techStack}
                  contributors={project.contributors}
                  maxContributors={project.maxContributors}
                  difficulty={project.difficulty}
                  stars={project.stars}
                  amountInINR={project.amountInINR}
                  index={i}
                />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">No projects found matching your criteria.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;
