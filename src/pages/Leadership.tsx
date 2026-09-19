import TopInfoBar from "@/components/TopInfoBar";
import MainNavbar from "@/components/MainNavbar";
import ChurchLeadersSection from "@/components/ChurchLeadersSection";
import SiteFooter from "@/components/SiteFooter";

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
      <SiteFooter />
    </div>
  );
};

export default Leadership;
