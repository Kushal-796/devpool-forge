import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

const Interview = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { firebaseUser } = useAuthContext();
  const [answers, setAnswers] = useState({
    experience: "",
    motivation: "",
    availability: "",
    skills: ""
  });

  const [project, setProject] = useState<any>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [paymentDone, setPaymentDone] = useState(false);

  const questions = [
    {
      id: "experience",
      question: "Tell us about your relevant experience with this project's technologies.",
      placeholder: "Describe your experience with React, Node.js, etc..."
    },
    {
      id: "motivation",
      question: "Why are you interested in joining this project?",
      placeholder: "What excites you about this project?"
    },
    {
      id: "availability",
      question: "How much time can you dedicate to this project per week?",
      placeholder: "e.g., 10-15 hours per week"
    },
    {
      id: "skills",
      question: "What specific skills or contributions can you bring to the team?",
      placeholder: "Frontend development, UI/UX design, testing, etc."
    }
  ];

  const handleSubmit = async () => {
    // Validate that all questions are answered
    const unanswered = questions.filter(q => !answers[q.id as keyof typeof answers]?.trim());
    if (unanswered.length > 0) {
      toast.error("Please answer all interview questions");
      return;
    }

    if (!firebaseUser || !projectId) return;

    try {
      const payload: any = {
        projectId,
        invitedUser: firebaseUser.uid,
        status: 'pending',
        sentAt: new Date(),
        interviewAnswers: answers,
      };
      if (paymentDone) {
        payload.paymentPaid = true;
        payload.amountPaid = project?.amountInINR ?? 0;
        payload.platformFee = project ? Math.round((project.amountInINR ?? 0) * 0.1) : 0;
      }

      await addDoc(collection(db, 'projectInvitations'), payload);
      toast.success("Interview submitted! The project owner will review your application.");
      navigate("/projects");
    } catch (error) {
      console.error("Failed to submit interview:", error);
      toast.error("Failed to submit interview");
    }
  };

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      try {
        const docRef = doc(db, 'projects', projectId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setProject({ id: snap.id, ...(snap.data() as any) });
        }
      } catch (err) {
        console.error('Failed to fetch project', err);
        toast.error('Failed to load project info');
      } finally {
        setLoadingProject(false);
      }
    };
    loadProject();
  }, [projectId]);

  if (!firebaseUser) {
    navigate("/login");
    return null;
  }

  if (!projectId) {
    toast.error("Invalid project ID");
    navigate("/projects");
    return null;
  }

  if (loadingProject) {
    return <div className="min-h-screen pt-24">Loading project...</div>;
  }

  const isLearner = firebaseUser && project && project.amountInINR && firebaseUser.role === 'learner';
  const platformFee = project ? Math.round((project.amountInINR ?? 0) * 0.1) : 0;
  const totalAmount = project ? (project.amountInINR ?? 0) + platformFee : 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Project Interview</h1>
            <p className="text-muted-foreground text-lg">
              Answer these questions to apply for the project. The project owner will review your responses.
            </p>
          </div>

          {isLearner && !paymentDone && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Required</CardTitle>
                <CardDescription>
                  This project requires a contribution of ₹{project?.amountInINR ?? 0} plus a 10% platform fee (₹{platformFee}).
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>Total: ₹{totalAmount}</div>
                <Button onClick={() => { setPaymentDone(true); toast.success("Payment successful!"); }} className="mt-2">
                  Pay ₹{totalAmount} and Continue
                </Button>
              </CardContent>
            </Card>
          )}
          {(!isLearner || paymentDone) && (
            <div className="space-y-6">
            {questions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{q.question}</CardTitle>
                    <CardDescription>{q.placeholder}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={answers[q.id as keyof typeof answers]}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder={q.placeholder}
                      className="min-h-[100px]"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
          {(!isLearner || paymentDone) && (
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate("/projects")}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="px-8">
                Submit Application
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Interview;