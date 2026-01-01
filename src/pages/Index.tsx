import TopInfoBar from "@/components/TopInfoBar";
import MainNavbar from "@/components/MainNavbar";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Heart, BookOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Info Bar */}
      <TopInfoBar />

      {/* Main Navigation */}
      <MainNavbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Quick Links Section */}
      <section id="content" className="py-16 md:py-24 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl text-center text-navy mb-4">
            How Can We Help You?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto font-body">
            Whether you're seeking spiritual guidance, looking to connect with our community, 
            or wanting to make a difference, we're here for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-card rounded-lg p-6 shadow-card hover:shadow-lg transition-shadow duration-300 group">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                <Calendar className="h-6 w-6 text-navy" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">Upcoming Events</h3>
              <p className="text-muted-foreground text-sm mb-4 font-body">
                Join us for worship services, community gatherings, and special celebrations.
              </p>
              <Button variant="link" className="p-0 text-navy hover:text-gold">
                View Calendar →
              </Button>
            </div>

            {/* Card 2 */}
            <div className="bg-card rounded-lg p-6 shadow-card hover:shadow-lg transition-shadow duration-300 group">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                <Users className="h-6 w-6 text-navy" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">Join a Group</h3>
              <p className="text-muted-foreground text-sm mb-4 font-body">
                Find your community through small groups, Bible studies, and fellowship.
              </p>
              <Button variant="link" className="p-0 text-navy hover:text-gold">
                Find Groups →
              </Button>
            </div>

            {/* Card 3 */}
            <div className="bg-card rounded-lg p-6 shadow-card hover:shadow-lg transition-shadow duration-300 group">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                <Heart className="h-6 w-6 text-navy" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">Give & Serve</h3>
              <p className="text-muted-foreground text-sm mb-4 font-body">
                Make a difference in our community through volunteering and generous giving.
              </p>
              <Button variant="link" className="p-0 text-navy hover:text-gold">
                Get Involved →
              </Button>
            </div>

            {/* Card 4 */}
            <div className="bg-card rounded-lg p-6 shadow-card hover:shadow-lg transition-shadow duration-300 group">
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                <BookOpen className="h-6 w-6 text-navy" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">Learn More</h3>
              <p className="text-muted-foreground text-sm mb-4 font-body">
                Explore our beliefs, mission, and the history of our faith community.
              </p>
              <Button variant="link" className="p-0 text-navy hover:text-gold">
                Our Story →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-4">
            Join Us This Sunday
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto font-body">
            Experience the warmth of our community. Service times: 9:00 AM & 11:00 AM
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="lg">
              Plan Your Visit
            </Button>
            <Button variant="goldOutline" size="lg">
              Watch Online
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark py-12 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-display text-xl mb-4">Faith Community Church</h3>
              <p className="text-primary-foreground/70 text-sm font-body">
                United in Christ, serving our community with love and compassion.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gold font-body">Quick Links</h4>
              <ul className="space-y-2 text-sm font-body">
                <li><a href="/about" className="text-primary-foreground/70 hover:text-gold transition-colors">About Us</a></li>
                <li><a href="/events" className="text-primary-foreground/70 hover:text-gold transition-colors">Events</a></li>
                <li><a href="/sermons" className="text-primary-foreground/70 hover:text-gold transition-colors">Sermons</a></li>
                <li><a href="/contact" className="text-primary-foreground/70 hover:text-gold transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gold font-body">Service Times</h4>
              <ul className="space-y-2 text-sm font-body text-primary-foreground/70">
                <li>Sunday: 9:00 AM & 11:00 AM</li>
                <li>Wednesday: 7:00 PM</li>
                <li>Friday Youth: 6:30 PM</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gold font-body">Contact Us</h4>
              <ul className="space-y-2 text-sm font-body text-primary-foreground/70">
                <li>123 Faith Avenue</li>
                <li>Community City, ST 12345</li>
                <li>+1 (555) 123-4567</li>
                <li>info@faithcommunity.org</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/50 font-body">
            <p>© 2025 Faith Community Church. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
