import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });

  const validate = (): boolean => {
    const newErrors = { username: "", password: "" };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem("quizUser", username);
      navigate("/quiz");
    }
  };

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
              <h3 className="text-xl font-display font-bold text-center">Login</h3>
            </div>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="h-11"
                  />
                  {errors.username && (
                    <p className="text-destructive text-sm">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11"
                  />
                  {errors.password && (
                    <p className="text-destructive text-sm">{errors.password}</p>
                  )}
                </div>

                <Button type="submit" className="w-full h-11 font-display text-base">
                  Let's get started!
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
