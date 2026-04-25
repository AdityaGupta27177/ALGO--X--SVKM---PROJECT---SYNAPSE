import { useState } from "react";
import Spline from '@splinetool/react-spline';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function SignIn() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
  };



  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
      options: {
        data: { display_name: signUpName },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "We've sent you a confirmation link to verify your account." });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] flex-col lg:flex-row overflow-hidden">
      {/* Left Column: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 z-20 relative">
        {/* Subtle glow behind form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="w-full max-w-sm animate-fade-in relative z-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20">
              <Gamepad2 className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">PROJECT <span className="text-primary">SYNAPSE</span></h1>
          </div>

          <div className="glass-card p-6 border-zinc-800 bg-black/40 backdrop-blur-xl">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="signin" className="font-semibold text-foreground data-[state=active]:text-primary data-[state=active]:bg-primary/10">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="font-semibold text-foreground data-[state=active]:text-primary data-[state=active]:bg-primary/10">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="si-email" className="text-sm text-muted-foreground">Email</Label>
                  <Input id="si-email" type="email" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} placeholder="john@example.com" className="mt-1 border-border bg-muted/50" required />
                </div>
                <div>
                  <Label htmlFor="si-password" className="text-sm text-muted-foreground">Password</Label>
                  <Input id="si-password" type="password" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} placeholder="••••••••" className="mt-1 border-border bg-muted/50" required />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 font-semibold text-primary-foreground">
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                <Link to="/forgot-password" className="block text-center text-xs text-muted-foreground hover:text-primary transition-colors">
                  Forgot your password?
                </Link>

              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="su-name" className="text-sm text-muted-foreground">Full Name</Label>
                  <Input id="su-name" value={signUpName} onChange={(e) => setSignUpName(e.target.value)} placeholder="John Doe" className="mt-1 border-border bg-muted/50" required />
                </div>
                <div>
                  <Label htmlFor="su-email" className="text-sm text-muted-foreground">Email</Label>
                  <Input id="su-email" type="email" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} placeholder="john@example.com" className="mt-1 border-border bg-muted/50" required />
                </div>
                <div>
                  <Label htmlFor="su-password" className="text-sm text-muted-foreground">Password</Label>
                  <Input id="su-password" type="password" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} placeholder="••••••••" className="mt-1 border-border bg-muted/50" required minLength={6} />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 font-semibold text-primary-foreground">
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500">Secure authentication powered by ALGO-X SYNAPSE</p>
      </div>
      </div>

      {/* Right Column: 3D Animation */}
      <div className="flex-1 min-h-[40vh] lg:min-h-screen relative flex items-center justify-center order-first lg:order-last border-l border-zinc-800/50">
        {/* Spline Component */}
        <div className="absolute inset-0 z-0">
          <Spline 
            scene="https://prod.spline.design/6phm6qYnmYticLXe/scene.splinecode" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Blending Overlays */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent lg:bg-gradient-to-l lg:from-[#0a0a0a]" />
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-[#0a0a0a] via-transparent to-transparent h-32 lg:h-full lg:w-32 lg:bg-gradient-to-r lg:from-[#0a0a0a]" />
      </div>
    </div>
  );
}
