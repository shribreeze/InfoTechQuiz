import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDocs, getDoc, addDoc, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase.js";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import QuizTimer from "@/components/QuizTimer";
import { CheckCircle, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface LeaderboardEntry {
  userName: string;
  score: number;
  timestamp: any;
}

const QUIZ_DURATION_MINUTES = 5;

const Quiz = () => {
  const navigate = useNavigate();
  const { topicId } = useParams<{ topicId: string }>();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topicName, setTopicName] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!topicId) return;
      
      try {
        // Fetch topic details
        const topicDoc = await getDoc(doc(db, "topics", topicId));
        if (topicDoc.exists()) {
          setTopicName(topicDoc.data().name);
        }

        // Fetch questions
        const questionsSnapshot = await getDocs(collection(db, "topics", topicId, "questions"));
        const questionsData = questionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Question[];
        setQuestions(questionsData);

        // Fetch leaderboard
        const leaderboardQuery = query(
          collection(db, "leaderboards", topicId, "scores"),
          orderBy("score", "desc"),
          limit(5)
        );
        const leaderboardSnapshot = await getDocs(leaderboardQuery);
        const leaderboardData = leaderboardSnapshot.docs.map(doc => doc.data()) as LeaderboardEntry[];
        setLeaderboard(leaderboardData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load quiz data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [topicId, toast]);

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        totalScore += 10;
      }
    });
    return totalScore;
  };

  const saveScore = async (finalScore: number) => {
    if (!currentUser || !topicId) return;
    
    try {
      await addDoc(collection(db, "leaderboards", topicId, "scores"), {
        userName: currentUser.email,
        score: finalScore,
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (submitted) return;
    
    const finalScore = calculateScore();
    setScore(finalScore);
    setSubmitted(true);
    setTimerActive(false);
    
    await saveScore(finalScore);
  }, [submitted, answers, questions]);

  const handleTimeUp = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  const handleProceed = () => {
    navigate("/topics");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading quiz...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Quiz Section */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold text-primary">
                  {topicName} Quiz
                </h2>
                {!submitted && (
                  <QuizTimer
                    durationMinutes={QUIZ_DURATION_MINUTES}
                    onTimeUp={handleTimeUp}
                    isActive={timerActive}
                  />
                )}
              </div>

              <div className="space-y-6">
                {questions.map((question, index) => (
                  <Card 
                    key={question.id} 
                    className="shadow-lg border-0 overflow-hidden transition-all hover:shadow-xl"
                  >
                    <div className="bg-secondary/60 p-4 border-b border-border">
                      <p className="font-medium text-foreground">
                        <span className="text-primary font-display">Q{index + 1})</span>{" "}
                        {question.question}
                      </p>
                    </div>
                    
                    <CardContent className="p-5">
                      <RadioGroup
                        value={answers[question.id]?.toString()}
                        onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                        disabled={submitted}
                      >
                        {question.options.map((option, optionIndex) => (
                          <div 
                            key={optionIndex}
                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer
                              ${answers[question.id] === optionIndex 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                              }
                              ${submitted ? 'cursor-not-allowed opacity-75' : ''}
                            `}
                          >
                            <RadioGroupItem 
                              value={optionIndex.toString()} 
                              id={`q${question.id}-${optionIndex}`}
                            />
                            <Label 
                              htmlFor={`q${question.id}-${optionIndex}`}
                              className="flex-1 cursor-pointer text-sm"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Result Section */}
              {submitted && (
                <Card className="mt-8 shadow-lg border-0 bg-success/10 border-success/30">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                    <p className="text-xl font-display font-bold text-success mb-4">
                      Your score is {score}!
                    </p>
                    <Button 
                      onClick={handleProceed}
                      className="bg-success hover:bg-success/90"
                    >
                      Back to Topics
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              {!submitted && (
                <div className="mt-8 text-center">
                  <Button 
                    onClick={handleSubmit}
                    size="lg"
                    className="px-12 font-display"
                    disabled={Object.keys(answers).length !== questions.length}
                  >
                    Submit Quiz
                  </Button>
                  {Object.keys(answers).length !== questions.length && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Please answer all questions to submit
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Leaderboard Section */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0 sticky top-8">
                <div className="bg-primary text-primary-foreground p-4">
                  <h3 className="font-display font-bold flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Top 5 Scores
                  </h3>
                </div>
                <CardContent className="p-4">
                  {leaderboard.length > 0 ? (
                    <div className="space-y-3">
                      {leaderboard.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded bg-secondary/30">
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-bold">#{index + 1}</span>
                            <span className="text-sm truncate">{entry.userName}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
