import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const More = () => {
  const menuItems = [
    { path: "/about", label: "Welcome" },
    { path: "/members", label: "Players" },
    { path: "/calendar", label: "Club Calendar" },
    { path: "/announcements", label: "Announcements" },
    { path: "/admin", label: "Admin Dashboard" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Menu</h1>
        <p className="text-muted-foreground text-lg">
          Access all club features and information
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
        {menuItems.map((item) => (
          <Button key={item.path} asChild size="sm" variant="secondary">
            <Link to={item.path}>{item.label}</Link>
          </Button>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Button asChild variant="outline" size="sm">
          <Link to="/">Back to Game Sessions</Link>
        </Button>
      </div>
    </div>
  );
};

export default More;
