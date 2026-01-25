import { Button } from "@/components/ui/button";
import { Calendar, UserPlus, Users, Trophy, Bell, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/golf-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Golf Course"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 md:mb-6 px-4">
            Welcome to Samba
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/90 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Join our community of passionate golfers and reserve your tee times today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="hero">
              <Link to="/">
                <Calendar className="h-5 w-5" />
                View Tee Times
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/join">
                <UserPlus className="h-5 w-5" />
                Join Our Club
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Access</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay connected with the Samba community
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-4xl mx-auto">
            <Button asChild size="lg" variant="default" className="flex-1">
              <Link to="/members">
                <Users className="h-5 w-5" />
                Member Listing
              </Link>
            </Button>
            <Button asChild size="lg" variant="default" className="flex-1">
              <Link to="/calendar">
                <CalendarDays className="h-5 w-5" />
                Club Calendar
              </Link>
            </Button>
            <Button asChild size="lg" variant="default" className="flex-1">
              <Link to="/announcements">
                <Bell className="h-5 w-5" />
                Special Announcements
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Offer</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to enjoy the game you love
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-8 rounded-lg shadow-card text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                <Calendar className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tee Time Management</h3>
              <p className="text-muted-foreground">
                Easy online booking system for all your tee times at premier golf courses
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg shadow-card text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Vibrant Community</h3>
              <p className="text-muted-foreground">
                Connect with fellow golf enthusiasts and build lasting friendships
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg shadow-card text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                <Trophy className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Exclusive Events</h3>
              <p className="text-muted-foreground">
                Participate in tournaments and special events throughout the year
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Become part of Samba today and start enjoying exclusive benefits
          </p>
          <Button asChild size="lg">
            <Link to="/join">
              <UserPlus className="h-5 w-5" />
              Apply for Membership
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
