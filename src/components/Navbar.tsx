import { Link, useLocation } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const isHome = location.pathname === "/";

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged out successfully!" });
    } catch (error) {
      toast({ 
        title: "Error logging out", 
        variant: "destructive" 
      });
    }
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center gap-2 font-display text-xl font-bold hover:opacity-90 transition-opacity"
          >
            <GraduationCap className="h-7 w-7" />
            <span>IQP</span>
          </Link>
          
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">{currentUser.email}</span>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            isHome && (
              <Link 
                to="/login"
                className="px-4 py-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors font-medium"
              >
                Login
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
