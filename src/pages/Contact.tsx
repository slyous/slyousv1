import { motion } from 'motion/react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Button from '@/src/components/ui/Button';

const Contact = () => {
  return (
    <div className="bg-void min-h-screen pt-32 pb-32">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <span className="status-label-themed inline-block mb-4">Reach Out</span>
          <h1 className="text-5xl font-serif text-white italic mb-6">Contact Us</h1>
          <p className="text-ivory/70 text-lg max-w-2xl">Our concierge team is available to assist you with inquiries, styling advice, or navigating your purchase journey.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8 pr-0 lg:pr-12"
          >
            <div>
              <h3 className="text-xl font-serif text-white mb-4">Our Presence</h3>
              <p className="text-ivory/70 font-sans leading-relaxed mb-6">
                With luxury showrooms in New York, Miami, Beverly Hills, Dallas, Chicago, London, and Paris, our global reach ensures we are always close to you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-bright-gold" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Phone</p>
                  <p className="text-ivory">+1 (800) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-bright-gold" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Email</p>
                  <p className="text-ivory">concierge@diamonds.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-bright-gold" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Headquarters</p>
                  <p className="text-ivory">New York, NY</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-graphite/40 border border-white/10 rounded-3xl p-8"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
               <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Name</label>
                  <input type="text" className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-colors" />
               </div>
               <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Email</label>
                  <input type="email" className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-colors" />
               </div>
               <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Subject</label>
                  <input type="text" className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-colors" />
               </div>
               <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Message</label>
                  <textarea rows={5} className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-colors resize-none"></textarea>
               </div>
               <Button type="submit" variant="primary" className="w-full">Send Message</Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
