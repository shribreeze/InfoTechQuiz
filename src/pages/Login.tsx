import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../firebase.js";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validate = (): boolean => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setShowVerificationMessage(true);
        toast({ 
          title: "Account created!", 
          description: "Please check your email to verify your account."
        });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Reload user to get updated emailVerified status
        await userCredential.user.reload();
        await refreshUser(); // Refresh the context state
        
        const updatedUser = auth.currentUser;
        if (!updatedUser?.emailVerified) {
          toast({
            title: "Email not verified",
            description: "Please verify your email before accessing the quiz.",
            variant: "destructive"
          });
          return;
        }
        toast({ title: "Logged in successfully!" });
        // Don't navigate here, let PublicRoute handle the redirect
      }
    } catch (error: any) {
      let errorMessage = "An error occurred";
      
      switch (error.code) {
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your internet connection and try again.";
          break;
        case 'auth/email-already-in-use':
          errorMessage = "This email is already registered. Please use a different email or try logging in.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak. Please use at least 6 characters.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = "Invalid email or password.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        default:
          errorMessage = error.message || "Authentication failed. Please try again.";
      }
      
      toast({ 
        title: "Error", 
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      toast({ 
        title: "Verification email sent!", 
        description: "Please check your email inbox."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email",
        variant: "destructive"
      });
    }
  };

  if (showVerificationMessage) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-primary mb-8">
            Infotech Quiz Portal (IQP)
          </h2>

          <div className="max-w-md mx-auto">
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="bg-primary text-primary-foreground p-5">
                <h3 className="text-xl font-display font-bold text-center flex items-center justify-center gap-2">
                  <Mail className="h-5 w-5" />
                  Verify Your Email
                </h3>
              </div>
              
              <CardContent className="p-6 text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-success mx-auto" />
                <div className="space-y-2">
                  <p className="text-lg font-semibold">Account Created Successfully!</p>
                  <p className="text-muted-foreground">
                    We've sent a verification email to <strong>{email}</strong>
                  </p>
                </div>
                
                <Alert>
                  <AlertDescription>
                    Please check your email and click the verification link to activate your account.
                    You won't be able to access the quiz until your email is verified.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3 pt-4">
                  <Button 
                    onClick={resendVerification}
                    variant="outline"
                    className="w-full"
                  >
                    Resend Verification Email
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setShowVerificationMessage(false);
                      setIsSignUp(false);
                    }}
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-primary mb-8">
          Infotech Quiz Portal (IQP)
        </h2>

        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="bg-primary text-primary-foreground p-5">
              <h3 className="text-xl font-display font-bold text-center">
                {isSignUp ? "Sign Up" : "Login"}
              </h3>
            </div>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-11"
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-destructive text-sm">{errors.password}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 font-display text-base"
                  disabled={loading}
                >
                  {loading ? "Please wait..." : (isSignUp ? "Create Account" : "Let's get started!")}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary hover:underline text-sm"
                >
                  {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign up"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
