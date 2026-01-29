import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

interface Topic {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  // icon: string;
}

const Topics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsSnapshot = await getDocs(collection(db, "topics"));
        const topicsData = topicsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Topic[];
        setTopics(topicsData);
      } catch (error: any) {
        console.error("Firestore error:", error);
        toast({
          title: "Error",
          description: "Failed to load topics",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [toast]);

  const handleTopicSelect = (topicId: string) => {
    navigate(`/quiz/${topicId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading topics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center text-primary mb-8">
            Choose Your Quiz Topic
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Card 
                key={topic.id}
                className="shadow-lg border-0 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                onClick={() => handleTopicSelect(topic.id)}
              >
                <CardContent className="p-6 text-center">
                  {/* <div className="text-4xl mb-4">{topic.icon}</div> */}
                  <h3 className="text-xl font-display font-bold text-primary mb-2">
                    {topic.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {topic.description}
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{topic.questionCount} Questions</span>
                    </div>
                  </div>
                  <Button className="w-full">
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topics;