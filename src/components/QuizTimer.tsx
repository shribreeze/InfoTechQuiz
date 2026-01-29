import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface QuizTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
  isActive: boolean;
}

const QuizTimer = ({ durationMinutes, onTimeUp, isActive }: QuizTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isLowTime = timeLeft <= 60;
  const isCritical = timeLeft <= 30;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold transition-colors ${
        isCritical
          ? "bg-destructive/10 text-destructive animate-pulse"
          : isLowTime
          ? "bg-warning/10 text-warning"
          : "bg-secondary text-foreground"
      }`}
    >
      <Clock className="h-5 w-5" />
      <span>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
};

export default QuizTimer;
