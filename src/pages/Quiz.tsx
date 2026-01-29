import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import QuizTimer from "@/components/QuizTimer";
import { quizQuestions, getPerformanceLabel } from "@/lib/quizData";
import { CheckCircle } from "lucide-react";

const QUIZ_DURATION_MINUTES = 5;

const Quiz = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  const handleAnswerChange = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    quizQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        totalScore += 10; // 10 points per correct answer
      }
    });
    return totalScore;
  };

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    
    const finalScore = calculateScore();
    setScore(finalScore);
    setSubmitted(true);
    setTimerActive(false);
    
    const performance = getPerformanceLabel(finalScore);
    localStorage.setItem("performanceDetails", performance);
    localStorage.setItem("quizScore", finalScore.toString());
  }, [submitted, answers]);

  const handleTimeUp = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  const handleProceed = () => {
    navigate("/results");
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-primary">
              Quiz Time!
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
            {quizQuestions.map((question) => (
              <Card 
                key={question.id} 
                className="shadow-lg border-0 overflow-hidden transition-all hover:shadow-xl"
              >
                <div className="bg-secondary/60 p-4 border-b border-border">
                  <p className="font-medium text-foreground">
                    <span className="text-primary font-display">Q{question.id})</span>{" "}
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
                    {question.options.map((option, index) => (
                      <div 
                        key={index}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer
                          ${answers[question.id] === index 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                          }
                          ${submitted ? 'cursor-not-allowed opacity-75' : ''}
                        `}
                      >
                        <RadioGroupItem 
                          value={index.toString()} 
                          id={`q${question.id}-${index}`}
                        />
                        <Label 
                          htmlFor={`q${question.id}-${index}`}
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
                  Click here to Proceed
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
                disabled={Object.keys(answers).length !== quizQuestions.length}
              >
                Submit Quiz
              </Button>
              {Object.keys(answers).length !== quizQuestions.length && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Please answer all questions to submit
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
