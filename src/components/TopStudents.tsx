import { Trophy, Medal, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface StudentScore {
  id: string;
  name: string;
  score: number;
  timestamp: number;
}

interface TopStudentsProps {
  students: StudentScore[];
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return null;
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "border-yellow-500/50 bg-yellow-500/5";
    case 2:
      return "border-gray-400/50 bg-gray-400/5";
    case 3:
      return "border-amber-600/50 bg-amber-600/5";
    default:
      return "border-border";
  }
};

const TopStudents = ({ students }: TopStudentsProps) => {
  const topStudents = [...students]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (topStudents.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-primary/5 border-b border-border pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Trophy className="h-5 w-5 text-primary" />
          Top Students
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {topStudents.map((student, index) => (
            <div
              key={student.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${getRankStyle(
                index + 1
              )}`}
            >
              <div className="flex items-center justify-center w-8 h-8">
                {getRankIcon(index + 1) || (
                  <span className="text-sm font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                )}
              </div>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {student.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {student.name}
                </p>
              </div>
              <Badge
                variant={index === 0 ? "default" : "secondary"}
                className="font-mono"
              >
                {student.score} pts
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopStudents;
