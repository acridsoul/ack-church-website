import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Sermon Notes Archive", href: "/sermons" },
  { label: "Ask the Archive", href: "/ask" },
  { label: "Clergy & Lay Leadership", href: "/leadership" },
  { label: "Parish Ministries", href: "/ministries" },
  { label: "Kanisa Mashinani (Prayer Cells)", href: "/prayer-cells" },
  { label: "Notices & Announcements", href: "/notices-announcements" },
];

const serviceTimes = [
  { time: "7:00 AM - 8:15 AM", label: "Express Service" },
  { time: "8:30 AM - 10:15 AM", label: "English Service" },
  { time: "10:30 AM - 12:30 PM", label: "Kikuyu Service" },
];

const SiteFooter = () => (
  <footer className="bg-navy-dark py-12 text-primary-foreground">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Church Branding */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/images/ack-diocese-logo.png"
              alt="A.C.K. Diocese of Thika Logo"
              className="h-12 w-auto object-contain"
            />
            <div>
              <h3 className="font-display text-lg font-bold">A.C.K. St. Stephen's Church</h3>
              <p className="text-xs text-gold">Gatuanyaga &bull; Diocese of Thika</p>
            </div>
          </div>
          <p className="text-primary-foreground/75 text-sm font-body leading-relaxed">
            United in Christ, serving our community with love and compassion.
          </p>
          <p className="text-primary-foreground/60 text-xs font-body mt-2 italic">
            "I can do all things through Christ" (Phil 4:13)
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4 text-gold font-body tracking-wider uppercase text-xs">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm font-body">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-primary-foreground/75 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Service Times */}
        <div>
          <h4 className="font-semibold mb-4 text-gold font-body tracking-wider uppercase text-xs">
            Sunday Service Times
          </h4>
          <ul className="space-y-2 text-sm font-body text-primary-foreground/75">
            {serviceTimes.map((service) => (
              <li key={service.label}>
                <span className="font-semibold text-primary-foreground block">
                  {service.time}
                </span>
                <span className="text-xs text-gold">{service.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4 text-gold font-body tracking-wider uppercase text-xs">
            Contact &amp; Location
          </h4>
          <ul className="space-y-2 text-sm font-body text-primary-foreground/75">
            <li>Gatuanyaga, Thika, Kenya</li>
            <li>
              <a href="tel:+254-7xxxxxxxx" className="hover:text-gold transition-colors">
                07xxxxxxxx
              </a>
            </li>
            <li>
              <a
                href="mailto:ackststephenschurch@gmail.com"
                className="hover:text-gold transition-colors break-all"
              >
                ackststephenschurch@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/50 font-body">
        <p>
          &copy; {new Date().getFullYear()} A.C.K. St. Stephen's Church Gatuanyaga. All
          rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
