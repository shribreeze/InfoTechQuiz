import { Link, useLocation } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

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
          
          {isHome && (
            <Link 
              to="/login"
              className="px-4 py-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
