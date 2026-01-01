import { Mail, Phone, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const TopInfoBar = () => {
  return (
    <div className="bg-navy text-primary-foreground py-1 sm:py-2 px-4">
      <div className="container mx-auto flex flex-row items-center justify-between gap-2">
        {/* Contact Info */}
        <div className="flex items-center gap-4 sm:gap-6 text-sm">
          <a 
            href="mailto:ackststephenschurch@gmail.com" 
            className="flex items-center gap-1.5 sm:gap-2 hover:text-gold transition-colors duration-200"
          >
            <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">ackststephenschurch@gmail.com</span>
          </a>
          <a 
            href="tel:+254-7xxxxxxxx" 
            className="flex items-center gap-1.5 sm:gap-2 hover:text-gold transition-colors duration-200"
          >
            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">07xxxxxxxx</span>
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a 
            href="#" 
            aria-label="Facebook"
            className="hover:text-gold transition-colors duration-200"
          >
            <Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>
          <a 
            href="#" 
            aria-label="Twitter"
            className="hover:text-gold transition-colors duration-200"
          >
            <Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>
          <a 
            href="#" 
            aria-label="Instagram"
            className="hover:text-gold transition-colors duration-200"
          >
            <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>
          <a 
            href="#" 
            aria-label="YouTube"
            className="hover:text-gold transition-colors duration-200"
          >
            <Youtube className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopInfoBar;
