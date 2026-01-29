import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import TopStudents, { StudentScore } from "@/components/TopStudents";
import { getLeaderboard, saveScore } from "@/lib/leaderboard";
import { CheckCircle, Home } from "lucide-react";

const Results = () => {
  const [performance, setPerformance] = useState("");
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [identification, setIdentification] = useState<string>("Anonymous");
  const [leaderboard, setLeaderboard] = useState<StudentScore[]>([]);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    const savedPerformance = localStorage.getItem("performanceDetails") || "Not Available";
    const savedScore = parseInt(localStorage.getItem("quizScore") || "0", 10);
    setPerformance(savedPerformance);
    setQuizScore(savedScore);
    setLeaderboard(getLeaderboard());
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    if (value.trim()) {
      setIdentification(value);
    } else if (employeeId.trim()) {
      setIdentification(employeeId);
    } else {
      setIdentification("Anonymous");
    }
  };

  const handleEmployeeIdChange = (value: string) => {
    setEmployeeId(value);
    if (value.trim() && !name.trim()) {
      setIdentification(value);
    }
  };

  const handleSubmit = () => {
    const finalIdentification = name.trim() || employeeId.trim() || "Anonymous";
    setIdentification(finalIdentification);
    
    // Save score to leaderboard
    saveScore(finalIdentification, quizScore);
    setLeaderboard(getLeaderboard());
    
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Top Students Leaderboard */}
          <TopStudents students={leaderboard} />
          
          {!submitted ? (
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="bg-primary text-primary-foreground p-5">
                <h3 className="text-xl font-display font-bold text-center">
                  Your Results
                </h3>
              </div>
              
              <CardContent className="p-6 space-y-6">
                {/* Performance Display */}
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-foreground">
                    Your performance is{" "}
                    <span className="font-bold text-primary">{performance}</span>, 
                    based on your scores. Please fill up the details mentioned below.
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Enter your name:</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Your name"
                      className="h-11"
                    />
                  </div>

                  <div className="text-center text-muted-foreground font-medium">
                    OR
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID:</Label>
                    <Input
                      id="employeeId"
                      type="text"
                      value={employeeId}
                      onChange={(e) => handleEmployeeIdChange(e.target.value)}
                      placeholder="Your employee ID"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="suggestion">Any suggestions for us?</Label>
                    <Textarea
                      id="suggestion"
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      placeholder="Share your feedback..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-full h-11 font-display"
                >
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                </div>
                
                <div className="bg-success/10 border border-success/30 rounded-lg p-6 space-y-3">
                  <div>
                    <span className="font-bold text-foreground">Employee Name or ID: </span>
                    <span className="text-primary font-medium">{identification}</span>
                  </div>
                  <div>
                    <span className="font-bold text-foreground">Suggestions: </span>
                    <span className="text-primary">{suggestion || "None"}</span>
                  </div>
                  <div className="pt-4 text-center">
                    <p className="text-lg font-display font-bold text-success">
                      Thank You for using the app!
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button asChild variant="outline" className="gap-2">
                    <Link to="/">
                      <Home className="h-4 w-4" />
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
