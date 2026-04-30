import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-void border-t border-white/5 pt-24 pb-12 px-6 lg:px-12">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8 mb-24">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-serif italic text-white mb-8">Veloura</h2>
            <p className="text-ivory/60 max-w-sm font-sans leading-relaxed mb-8">
              A cinematic luxury diamond boutique that feels like a high-end editorial magazine and a trusted e-commerce store at the same time.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-void transition-all">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link to="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-void transition-all">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link to="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-void transition-all">
                <Facebook className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans text-bright-gold mb-8">Collection</h4>
            <ul className="space-y-4">
              {['Round Cut', 'Princess Cut', 'Emerald Cut', 'Oval Cut', 'Engagement Rings'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-ivory/60 hover:text-white transition-colors flex items-center group">
                    {item}
                    <ArrowUpRight className="w-3 h-3 ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans text-bright-gold mb-8">Service</h4>
            <ul className="space-y-4">
              {['Certification', 'Insurance', 'Authenticity', 'Shipping', 'Returns'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-ivory/60 hover:text-white transition-colors flex items-center group">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans text-bright-gold mb-8">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Boutique Locations', 'Consultation', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-ivory/60 hover:text-white transition-colors flex items-center group">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-12 text-[11px] font-mono uppercase tracking-widest text-muted-text">
          <p>© 2026 Veloura Luxury Diamonds. All Rights Reserved.</p>
          <div className="flex gap-12 mt-8 md:mt-0">
            <Link to="#" className="hover:text-ivory">Privacy Policy</Link>
            <Link to="#" className="hover:text-ivory">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
