import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Bounties from "./pages/Bounties";
import Developers from "./pages/Developers";
import Profile from "./pages/Profile";
import Workspace from "./pages/Workspace";
import Login from "./pages/Login";
import Interview from "./pages/Interview";
import RoleRoute from "./components/RoleRoute";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projects" element={<RoleRoute allowed={["learner","developer","owner","admin"]} element={<Projects />} />} />
            <Route path="/bounties" element={<RoleRoute allowed={["learner","developer","owner","admin"]} element={<Bounties />} />} />
            <Route path="/developers" element={<RoleRoute allowed={["developer","owner","admin"]} element={<Developers />} />} />
            <Route path="/profile" element={<RoleRoute allowed={["learner","developer","owner","admin"]} element={<Profile />} />} />
            <Route path="/workspace" element={<RoleRoute allowed={["developer","owner","admin"]} element={<Workspace />} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/interview/:projectId" element={<RoleRoute allowed={["developer","owner","admin","learner"]} element={<Interview />} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
