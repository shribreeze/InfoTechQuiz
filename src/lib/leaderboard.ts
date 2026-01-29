import { StudentScore } from "@/components/TopStudents";

const LEADERBOARD_KEY = "quiz_leaderboard";

export const getLeaderboard = (): StudentScore[] => {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveScore = (name: string, score: number): StudentScore => {
  const leaderboard = getLeaderboard();
  
  const newEntry: StudentScore = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: name || "Anonymous",
    score,
    timestamp: Date.now(),
  };

  leaderboard.push(newEntry);
  
  // Keep only top 50 scores
  const sortedLeaderboard = leaderboard
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);

  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(sortedLeaderboard));
  
  return newEntry;
};

export const clearLeaderboard = (): void => {
  localStorage.removeItem(LEADERBOARD_KEY);
};
