import { Link } from "react-router-dom";
import { CircleDot, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-hero shadow-soft sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <CircleDot className="h-8 w-8 text-primary-foreground" />
              <span className="text-xl font-bold text-primary-foreground">Samba</span>
            </Link>
            
            <Button asChild variant="secondary" size="sm">
              <Link to="/more" className="flex items-center gap-2">
                <Menu className="h-4 w-4" />
                More
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2025 Samba. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
