import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size="lg" />
            <p className="text-sidebar-foreground/70 text-sm">
              Empowering Kenyan farmers with technology. Connect, trade, and grow with AgriNova.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sidebar-primary">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/marketplace" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/prices" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Market Prices
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="font-semibold mb-4 text-sidebar-primary">For Users</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/auth?mode=signup&role=farmer" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Farmers
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=signup&role=buyer" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Buyers
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=signup&role=seller" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  Sellers
                </Link>
              </li>
              <li>
                <Link to="/ussd" className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                  USSD Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sidebar-primary">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-sidebar-foreground/70">
                <Phone size={16} />
                <span>+254 700 123 456</span>
              </li>
              <li className="flex items-center gap-2 text-sidebar-foreground/70">
                <Mail size={16} />
                <span>support@agrinova.co.ke</span>
              </li>
              <li className="flex items-center gap-2 text-sidebar-foreground/70">
                <MapPin size={16} />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-sidebar-border text-center text-sm text-sidebar-foreground/50">
          <p>© {new Date().getFullYear()} AgriNova. All rights reserved. Made with ❤️ for Kenyan Farmers.</p>
        </div>
      </div>
    </footer>
  );
}