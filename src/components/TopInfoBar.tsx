import { Mail, Phone, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const TopInfoBar = () => {
  return (
    <div className="bg-navy text-primary-foreground py-2 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Contact Info */}
        <div className="flex items-center gap-6 text-sm">
          <a 
            href="mailto:info@faithcommunity.org" 
            className="flex items-center gap-2 hover:text-gold transition-colors duration-200"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">info@faithcommunity.org</span>
          </a>
          <a 
            href="tel:+1-555-123-4567" 
            className="flex items-center gap-2 hover:text-gold transition-colors duration-200"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">+1 (555) 123-4567</span>
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <a 
            href="#" 
            aria-label="Facebook"
            className="hover:text-gold transition-colors duration-200"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a 
            href="#" 
            aria-label="Twitter"
            className="hover:text-gold transition-colors duration-200"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a 
            href="#" 
            aria-label="Instagram"
            className="hover:text-gold transition-colors duration-200"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a 
            href="#" 
            aria-label="YouTube"
            className="hover:text-gold transition-colors duration-200"
          >
            <Youtube className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopInfoBar;
