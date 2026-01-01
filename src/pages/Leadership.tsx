import TopInfoBar from "@/components/TopInfoBar";
import MainNavbar from "@/components/MainNavbar";
import ChurchLeadersSection from "@/components/ChurchLeadersSection";

const Leadership = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Info Bar */}
      <TopInfoBar />

      {/* Main Navigation */}
      <MainNavbar />

      {/* Church Leaders Section */}
      <ChurchLeadersSection />

      {/* Footer */}
      <footer className="bg-navy-dark py-12 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/images/ack-diocese-logo.png" 
                  alt="A.C.K. Diocese of Thika Logo" 
                  className="h-12 w-auto"
                />
                <h3 className="font-display text-lg">A.C.K. St. Stephen's Church</h3>
              </div>
              <p className="text-primary-foreground/70 text-sm font-body">
                Gatuanyaga - A.C.K. Diocese of Thika. United in Christ, serving our community with love and compassion.
              </p>
              <p className="text-primary-foreground/60 text-xs font-body mt-2 italic">
                "I can do all things through Christ"
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gold font-body">Quick Links</h4>
              <ul className="space-y-2 text-sm font-body">
                <li><a href="/" className="text-primary-foreground/70 hover:text-gold transition-colors">Home</a></li>
                <li><a href="/about" className="text-primary-foreground/70 hover:text-gold transition-colors">About Us</a></li>
                <li><a href="/events" className="text-primary-foreground/70 hover:text-gold transition-colors">Events</a></li>
                <li><a href="/contact" className="text-primary-foreground/70 hover:text-gold transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gold font-body">Sunday Service Times</h4>
              <ul className="space-y-2 text-sm font-body text-primary-foreground/70">
                <li>7:00 AM - Express Service</li>
                <li>8:30 AM - English Service</li>
                <li>10:30 AM - Kikuyu Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gold font-body">Contact Us</h4>
              <ul className="space-y-2 text-sm font-body text-primary-foreground/70">
                <li>Gatuanyaga, Kenya</li>
                <li>07xxxxxxxx</li>
                <li>ackststephenschurch@gmail.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/50 font-body">
            <p>© 2025 A.C.K. St. Stephen's Church Gatuanyaga. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Leadership;
