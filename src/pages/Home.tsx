import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { founders, manager } from "@/lib/quizData";

const Home = () => {
  const founderNames = founders.join(", ");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="relative">
        {/* Hero gradient overlay */}
        <div className="absolute inset-0 bg-[var(--gradient-hero)] pointer-events-none" />
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Main Card */}
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="bg-primary text-primary-foreground p-6">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-center">
                  Infotech Quiz Portal (IQP)
                </h1>
              </div>
              
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed text-foreground/80 text-justify mb-8">
                  <span className="inline-block w-12" />
                  Infotech Quiz Portal or better known as IQP is a fully operational web 
                  application for people who are looking for a way to test their knowledge 
                  on different programming languages. It is over a decade old and the core 
                  members are <span className="font-semibold text-primary">{founderNames}</span>. 
                  The Admin of this awesome endeavor is <span className="font-semibold text-primary">{founders[0]}</span> and 
                  the web manager is <span className="font-semibold text-primary">{manager}</span>.
                </p>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50">
                    <BookOpen className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm font-medium text-center">Multiple Topics</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm font-medium text-center">Expert Team</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50">
                    <Trophy className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm font-medium text-center">Track Progress</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Ready to test your knowledge?</p>
                  <Button asChild size="lg" className="gap-2 font-display">
                    <Link to="/login">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
