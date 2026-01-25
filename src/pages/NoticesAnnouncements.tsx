import TopInfoBar from "@/components/TopInfoBar";
import MainNavbar from "@/components/MainNavbar";
import { Bell } from "lucide-react";

const NoticesAnnouncements = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Info Bar */}
      <TopInfoBar />

      {/* Main Navigation */}
      <MainNavbar />

      {/* Info Section */}
      <section className="py-16 md:py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Bell className="h-12 w-12 text-gold mx-auto mb-4" />
          <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-2">
            Current <span className="text-gold italic">Notices</span>
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto font-body">
            Stay informed with the latest church notices and announcements
          </p>
          <p className="text-gold/90 text-sm mb-6 font-body">
            Latest Update: <span className="italic">25th January 2026</span>
          </p>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-navy py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-primary-foreground mb-4">
            Notices/<span className="text-gold italic">Announcements</span>
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto font-body">
            Stay updated with the latest notices and announcements from A.C.K. St. Stephen's Church Gatuanyaga.
          </p>
        </div>
      </section>

      {/* Notices and Communication Sections */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Notices Section */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-4">
                <span className="text-gold italic">Notices</span>
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto font-body">
                Important notices and updates will be posted here.
              </p>
              <div className="bg-card border border-border rounded-lg p-8 text-left min-h-[300px]">
                <div className="space-y-4">
                  <p className="font-body font-semibold text-foreground mb-4">
                    25/01/2026 - Church elections for the leaders for next two year term
                  </p>
                  <ul className="space-y-3 font-body text-foreground/90 list-disc list-inside">
                    <li>Confirmation classes already started<br />You can register with Lay Reader Damaris</li>
                    <li>You are reminded to honor your development pledges that were made at the end of the year</li>
                    <li>The church school is vacant. Interested persons should apply.<br />Interviews for applicants currently going on.</li>
                    <li>We have a security guard in the church compound guarding the compound during the night From Monday To Sunday<br />(And also during the Sunday service)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Communication Section */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-center text-navy mb-4">
                <span className="text-gold italic">Communication</span>
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto font-body">
                Church communications and messages will be shared here.
              </p>
              <div className="bg-card border border-border rounded-lg p-8 text-center min-h-[300px]">
                <p className="text-muted-foreground font-body">
                  Content will be added here soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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

export default NoticesAnnouncements;

