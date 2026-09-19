import TopInfoBar from "@/components/TopInfoBar";
import MainNavbar from "@/components/MainNavbar";
import SiteFooter from "@/components/SiteFooter";
import { Bell } from "lucide-react";

const NoticesAnnouncements = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Info Bar */}
      <TopInfoBar />

      {/* Main Navigation */}
      <MainNavbar />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Bell className="h-12 w-12 text-gold mx-auto mb-4" />
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
              <div className="bg-card border border-border rounded-lg p-8 text-center min-h-[300px]">
                <p className="text-muted-foreground font-body">
                  No notices at the moment.
                </p>
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
      <SiteFooter />
    </div>
  );
};

export default NoticesAnnouncements;

