
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Lock, Mail, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check for returning OAuth users
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        localStorage.setItem('isSignedUp', 'true');
        localStorage.setItem('isLoggedIn', 'true');
        if (session.user?.email) {
          localStorage.setItem('userEmail', session.user.email);
        }
        // For Google signup, set a default name if not available
        const userName = session.user?.user_metadata?.full_name || 
                         session.user?.user_metadata?.name || 
                         "User";
        localStorage.setItem('userName', userName);
        navigate('/onboarding');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      
      if (error) {
        console.error("Signup error:", error);
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        
        // For demo purposes, allow signup anyway
        localStorage.setItem('isSignedUp', 'true');
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        
        toast({
          title: "Account created (Demo Mode)",
          description: "Let's set up your styling preferences!",
        });
        
        navigate('/onboarding');
        return;
      }
      
      // Successful signup
      localStorage.setItem('isSignedUp', 'true');
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      
      toast({
        title: "Account created",
        description: "Let's set up your styling preferences!",
      });
      
      navigate('/onboarding');
    } catch (error: any) {
      console.error("Signup error caught:", error);
      
      // For demo purposes, allow signup anyway
      localStorage.setItem('isSignedUp', 'true');
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      
      toast({
        title: "Account created (Demo Mode)",
        description: "Let's set up your styling preferences!",
      });
      
      navigate('/onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/onboarding',
        }
      });
      
      if (error) {
        console.error("Google signup error:", error);
        toast({
          title: "Google signup failed",
          description: error.message,
          variant: "destructive",
        });
      }
      
      // The actual redirect and session handling happens automatically
      // when the user returns from Google OAuth flow via onAuthStateChange
    } catch (error: any) {
      console.error("Google signup error caught:", error);
      toast({
        title: "Google signup failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <UserPlus className="h-16 w-16 rounded-full bg-primary/10 p-3 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your information to get started with Smart Styler
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  className="pl-10" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>

            <div className="flex items-center gap-4 my-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>

            <Button 
              type="button"
              variant="outline"
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading}
              className="w-full"
            >
              {isGoogleLoading ? "Connecting..." : "Sign up with Google"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
