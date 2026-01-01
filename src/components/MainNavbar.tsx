import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const navItems = [
  { label: "Home", href: "/" },
  { label: "What We Believe", href: "/beliefs" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our History", href: "/about/history" },
      { label: "Our Mission", href: "/about/mission" },
      { label: "Our Vision", href: "/about/vision" },
    ],
  },
  {
    label: "Strategies",
    href: "/strategies",
    children: [
      { label: "Community Outreach", href: "/strategies/outreach" },
      { label: "Youth Programs", href: "/strategies/youth" },
      { label: "Missions", href: "/strategies/missions" },
    ],
  },
  { label: "Leadership", href: "/leadership" },
  { label: "Events", href: "/events" },
  { label: "Newsletters", href: "/newsletters" },
  { label: "Careers", href: "/careers" },
];

const MainNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-background border-b border-border py-3 px-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="w-full h-full">
              {/* Church building silhouette */}
              <circle cx="32" cy="32" r="30" fill="hsl(220, 45%, 20%)" />
              {/* Cross */}
              <rect x="29" y="12" width="6" height="20" fill="hsl(42, 70%, 50%)" />
              <rect x="24" y="17" width="16" height="6" fill="hsl(42, 70%, 50%)" />
              {/* Church roof */}
              <polygon points="32,28 16,42 48,42" fill="hsl(0, 62%, 45%)" />
              {/* Church body */}
              <rect x="20" y="42" width="24" height="14" fill="hsl(0, 62%, 45%)" />
              {/* Door */}
              <rect x="28" y="48" width="8" height="8" fill="hsl(220, 45%, 20%)" />
            </svg>
          </div>
          <div className="hidden md:block">
            <h1 className="font-display text-xl font-bold text-navy leading-tight">
              Faith Community
            </h1>
            <p className="text-xs text-muted-foreground">United in Christ</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.label}>
                  {item.children ? (
                    <>
                      <NavigationMenuTrigger className="text-foreground hover:text-navy font-body">
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-48 gap-1 p-2">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={child.href}
                                  className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground font-body text-sm"
                                >
                                  {child.label}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.href}
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 font-body"
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="navyOutline" size="sm">
            Partner With Us
          </Button>
          <Button variant="gold" size="sm">
            Donate
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg animate-fade-in">
          <div className="container mx-auto py-4 px-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    className="block py-2 px-4 text-foreground hover:bg-accent rounded-md font-body"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block py-2 px-4 text-muted-foreground hover:bg-accent rounded-md text-sm font-body"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                <Button variant="navyOutline" className="w-full">
                  Partner With Us
                </Button>
                <Button variant="gold" className="w-full">
                  Donate
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavbar;
