
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="rounded-full bg-rajasthan-blue p-1">
                <img
                  src="/logo.svg"
                  alt="Alumni Nexus"
                  className="h-8 w-8"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/32/1E40AF/FFFFFF?text=AN";
                  }}
                />
              </div>
              <span className="font-bold text-rajasthan-blue text-xl">
                Alumni Nexus
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Connecting alumni and students of Technical Education Department, Govt. of Rajasthan for mentorship, networking, and career guidance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-rajasthan-blue transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-rajasthan-blue transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-rajasthan-blue transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-rajasthan-blue transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-foreground transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/mentorship" className="text-muted-foreground hover:text-foreground transition-colors">
                  Mentorship
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-muted-foreground hover:text-foreground transition-colors">
                  Discussion Forum
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/career-resources" className="text-muted-foreground hover:text-foreground transition-colors">
                  Career Resources
                </Link>
              </li>
              <li>
                <Link to="/alumni-directory" className="text-muted-foreground hover:text-foreground transition-colors">
                  Alumni Directory
                </Link>
              </li>
              <li>
                <Link to="/job-board" className="text-muted-foreground hover:text-foreground transition-colors">
                  Job Board
                </Link>
              </li>
              <li>
                <Link to="/scholarships" className="text-muted-foreground hover:text-foreground transition-colors">
                  Scholarships
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-muted-foreground hover:text-foreground transition-colors">
                  Research Opportunities
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-4">Contact</h3>
            <address className="not-italic text-sm text-muted-foreground">
              <p>Technical Education Department</p>
              <p>Government of Rajasthan</p>
              <p>W-6, Residency Road, Jodhpur</p>
              <p>Rajasthan, India</p>
              <p className="mt-2">
                <a href="mailto:contact@alumnexus.raj.gov.in" className="hover:text-foreground transition-colors">
                  contact@alumnexus.raj.gov.in
                </a>
              </p>
              <p>
                <a href="tel:+91-291-2434271" className="hover:text-foreground transition-colors">
                  +91-291-2434271
                </a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-muted flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Alumni Nexus - Technical Education Department, Govt. of Rajasthan
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Use
            </Link>
            <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
              Cookies Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
