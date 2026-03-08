import { motion } from "framer-motion";
import { MapPin, Github, Trophy, Star, Award, Calendar, Settings } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { UserRole, Project } from "@/types";
import { useState, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard";

const Profile = () => {
  const { userProfile, firebaseUser, loading } = useAuthContext();
  const [ownedProjects, setOwnedProjects] = useState<Project[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]); // for developers
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Fetch owned projects for owner role and joined projects for developer role
  useEffect(() => {
    const fetchOwnedProjects = async () => {
      if (!firebaseUser || userProfile?.role !== 'owner') return;

      setProjectsLoading(true);
      try {
        const q = query(
          collection(db, 'projects'),
          where('ownerId', '==', firebaseUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const projects: Project[] = [];
        querySnapshot.forEach((doc) => {
          projects.push({ id: doc.id, ...doc.data() } as Project);
        });
        setOwnedProjects(projects);
      } catch (error) {
        console.error('Error fetching owned projects:', error);
        toast.error('Failed to load owned projects');
      } finally {
        setProjectsLoading(false);
      }
    };

    const fetchUserProjects = async () => {
      if (!firebaseUser || userProfile?.role !== 'developer') return;

      setProjectsLoading(true);
      try {
        // first get membership docs
        const mQ = query(
          collection(db, 'projectMembers'),
          where('userId', '==', firebaseUser.uid)
        );
        const memSnap = await getDocs(mQ);
        const projectIds: string[] = [];
        memSnap.forEach((mDoc) => {
          projectIds.push(mDoc.data().projectId);
        });
        if (projectIds.length === 0) {
          setUserProjects([]);
          return;
        }
        // fetch projects by id, batch using in
        const chunks: string[][] = [];
        while (projectIds.length) {
          chunks.push(projectIds.splice(0, 10));
        }
        const projects: Project[] = [];
        for (const chunk of chunks) {
          const pQ = query(
            collection(db, 'projects'),
            where('__name__', 'in', chunk)
          );
          const pSnap = await getDocs(pQ);
          pSnap.forEach((pDoc) => {
            projects.push({ id: pDoc.id, ...pDoc.data() } as Project);
          });
        }
        setUserProjects(projects);
      } catch (error) {
        console.error('Error fetching user projects:', error);
        toast.error('Failed to load your projects');
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchOwnedProjects();
    fetchUserProjects();
  }, [firebaseUser, userProfile?.role]);

  const handleRoleChange = async (newRole: UserRole) => {
    if (!firebaseUser || !userProfile) return;

    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        role: newRole,
        updatedAt: new Date()
      });
      toast.success("Role updated successfully!");
      // Note: You might want to refresh the userProfile or update context
      window.location.reload(); // Temporary solution to refresh the profile
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Failed to update role");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <span>Loading profile...</span>
      </div>
    );
  }

  if (!firebaseUser) {
    // not logged in
    return <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">Please log in to view your profile.</div>;
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <span>User profile not found.</span>
      </div>
    );
  }

  const p = {
    name: userProfile.name || "Unknown User",
    title: userProfile.role ? userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1) : "User",
    location: "Unknown", // Add location to User type if needed
    bio: userProfile.bio || "No bio available",
    avatar: userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U",
    reputation: userProfile.reputationScore || 0,
    rank: 1, // Calculate rank if needed
    githubStats: { repos: 0, followers: 0, stars: 0, contributions: 0 }, // Fetch from repositories if needed
    badges: ["New Member"], // Add badges logic
  };

  const renderRoleSpecificContent = () => {
    switch (userProfile.role) {
      case 'learner':
        return (
          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-3">Learning Progress</h3>
              <p className="text-muted-foreground">Track your learning journey and completed projects.</p>
              {/* Add learner-specific content */}
            </div>
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-3">Available Bounties</h3>
              <p className="text-muted-foreground">Find bounties to work on and earn rewards.</p>
            </div>
          </div>
        );
      case 'developer':
        return (
          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-3">My Projects</h3>
              <p className="text-muted-foreground mb-4">Projects you're contributing to.</p>
              {projectsLoading ? (
                <div className="text-center py-4">Loading projects...</div>
              ) : userProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You are not part of any projects yet.</p>
                  <Button className="mt-4" onClick={() => window.location.href = '/projects'}>
                    Browse Projects
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      id={project.id}
                      title={project.title}
                      description={project.description}
                      techStack={project.techStack}
                      contributors={project.currentMembers || 0}
                      maxContributors={project.maxTeamSize}
                      difficulty={project.difficulty}
                      stars={project.stars || 0}
                      amountInINR={project.amountInINR}
                      index={index}
                      buttonText="View Project"
                      onButtonClick={() => {
                        toast.info(`Viewing project: ${project.title}`);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-3">Skills & Technologies</h3>
              <p className="text-muted-foreground">Your technical skills and expertise.</p>
            </div>
          </div>
        );
      case 'owner':
        return (
          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-3">My Projects</h3>
              <p className="text-muted-foreground mb-4">Projects you own and manage.</p>
              {projectsLoading ? (
                <div className="text-center py-4">Loading projects...</div>
              ) : ownedProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You haven't created any projects yet.</p>
                  <Button className="mt-4" onClick={() => window.location.href = '/projects'}>
                    Create Your First Project
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ownedProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      id={project.id}
                      title={project.title}
                      description={project.description}
                      techStack={project.techStack}
                      contributors={project.currentMembers || 0}
                      maxContributors={project.maxTeamSize}
                      difficulty={project.difficulty}
                      stars={project.stars || 0}
                      amountInINR={project.amountInINR}
                      index={index}
                      buttonText="Manage Project"
                      onButtonClick={() => {
                        // TODO: Navigate to project management page
                        toast.info(`Manage project: ${project.title}`);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-3">Team Management</h3>
              <p className="text-muted-foreground">Manage your project teams and invitations.</p>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-3">Admin Dashboard</h3>
              <p className="text-muted-foreground">Manage users, projects, and platform settings.</p>
            </div>
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-3">System Analytics</h3>
              <p className="text-muted-foreground">View platform statistics and user activity.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Settings className="w-4 h-4" />Account Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Change Role</label>
                  <Select value={userProfile.role || "learner"} onValueChange={handleRoleChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="learner">Learner</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="owner">Project Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            {renderRoleSpecificContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
