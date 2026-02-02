import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase.js";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { CheckCircle, Trophy, Medal, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LeaderboardEntry {
  userName: string;
  score: number;
  timestamp: any;
}

const Results = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [topicName, setTopicName] = useState("");
  const [loading, setLoading] = useState(true);
  
  const score = location.state?.score || 0;
  const topicNameFromState = location.state?.topicName || "";

  useEffect(() => {
    const fetchData = async () => {
      if (!topicId) return;
      
      try {
        if (!topicNameFromState) {
          const topicDoc = await getDoc(doc(db, "topics", topicId));
          if (topicDoc.exists()) {
            setTopicName(topicDoc.data().name);
          }
        } else {
          setTopicName(topicNameFromState);
        }

        // Fetch leaderboard
        const leaderboardQuery = query(
          collection(db, "leaderboards", topicId, "scores"),
          orderBy("score", "desc")
        );
        const leaderboardSnapshot = await getDocs(leaderboardQuery);
        const leaderboardData = leaderboardSnapshot.docs.map(doc => doc.data()) as LeaderboardEntry[];
        setLeaderboard(leaderboardData);

        // Find user rank
        const userEmail = currentUser?.email;
        if (userEmail) {
          const userIndex = leaderboardData.findIndex(entry => entry.userName === userEmail);
          if (userIndex !== -1) {
            setUserRank(userIndex + 1);
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load results data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId, currentUser, topicNameFromState, toast]);

  const handleSubmit = async () => {
    if (!topicId || !currentUser) return;
    
    try {
      // Save feedback if provided
      if (feedback.trim()) {
        await addDoc(collection(db, "feedback"), {
          topicId,
          topicName,
          userName: name.trim() || currentUser.email,
          employeeId: employeeId.trim() || "",
          userEmail: currentUser.email,
          feedback: feedback.trim(),
          score,
          timestamp: new Date()
        });
      }
      
      setSubmitted(true);
      toast({ title: "Feedback submitted successfully!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive"
      });
    }
  };

  const getPerformanceMessage = (score: number) => {
    const maxScore = 50; // 5 questions × 10 points each
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 90) return "Excellent! Outstanding performance!";
    if (percentage >= 80) return "Very Good! Great job!";
    if (percentage >= 70) return "Good! Well done!";
    if (percentage >= 60) return "Satisfactory! Keep improving!";
    return "Needs Improvement! Don't give up!";
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-primary">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading results...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-display font-bold text-center text-primary mb-8">
            {topicName} Quiz Results
          </h2>
          
          {!submitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feedback Form */}
              <Card className="shadow-xl border-0 overflow-hidden">
                <div className="bg-primary text-primary-foreground p-5">
                  <h3 className="text-xl font-display font-bold text-center">
                    Submit Details
                  </h3>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary mb-2">Your Score: {score}</p>
                    <p className="text-lg font-semibold text-success mb-2">
                      {getPerformanceMessage(score)}
                    </p>
                    {userRank && (
                      <p className="text-lg text-muted-foreground">
                        Current Rank: #{userRank}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name (Optional)</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID (Optional)</Label>
                    <Input
                      id="employeeId"
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="Enter your employee ID"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback (Optional)</Label>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share your feedback about the quiz..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    className="w-full h-11 font-display"
                  >
                    Submit & View Leaderboard
                  </Button>
                </CardContent>
              </Card>

              {/* Top 5 Leaderboard Preview */}
              <Card className="shadow-xl border-0">
                <div className="bg-primary text-primary-foreground p-5">
                  <h3 className="font-display font-bold flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Top 5 Rankings
                  </h3>
                </div>
                <CardContent className="p-6">
                  {leaderboard.slice(0, 5).length > 0 ? (
                    <div className="space-y-3">
                      {leaderboard.slice(0, 5).map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded bg-secondary/30">
                          <div className="flex items-center gap-3">
                            {getRankIcon(index + 1)}
                            <span className="text-sm font-medium truncate">{entry.userName}</span>
                          </div>
                          <span className="font-bold text-primary">{entry.score}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      No scores yet. Be the first!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <Card className="shadow-xl border-0 bg-success/10 border-success/30">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                  <h3 className="text-2xl font-display font-bold text-success mb-2">
                    Thank You!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Your feedback has been submitted successfully.
                  </p>
                </CardContent>
              </Card>

              {/* Full Leaderboard */}
              <Card className="shadow-xl border-0">
                <div className="bg-primary text-primary-foreground p-5">
                  <h3 className="text-xl font-display font-bold text-center">
                    {topicName} Leaderboard
                  </h3>
                </div>
                <CardContent className="p-6">
                  {leaderboard.length > 0 ? (
                    <div className="space-y-3">
                      {leaderboard.map((entry, index) => {
                        const isCurrentUser = entry.userName === currentUser?.email;
                        return (
                          <div 
                            key={index} 
                            className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                              isCurrentUser ? 'border-primary bg-primary/5' : 'border-border bg-secondary/20'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              {getRankIcon(index + 1)}
                              <div>
                                <span className={`font-medium ${
                                  isCurrentUser ? 'text-primary font-bold' : 'text-foreground'
                                }`}>
                                  {entry.userName} {isCurrentUser && '(You)'}
                                </span>
                              </div>
                            </div>
                            <span className={`font-bold ${
                              isCurrentUser ? 'text-primary text-lg' : 'text-foreground'
                            }`}>
                              {entry.score}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No scores available yet.
                    </p>
                  )}
                </CardContent>
              </Card>

              <div className="text-center">
                <Button 
                  onClick={() => navigate("/topics")}
                  className="px-8"
                >
                  Back to Topics
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
