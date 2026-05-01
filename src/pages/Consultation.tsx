import { motion } from 'motion/react';
import Button from '@/src/components/ui/Button';

const Consultation = () => {
  return (
    <div className="bg-void min-h-screen pt-32 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="status-label-themed inline-block mb-4">Tailored Experience</span>
          <h1 className="text-4xl font-serif text-white italic mb-4">Private Consultation</h1>
          <p className="text-ivory/70 text-lg max-w-2xl mx-auto">Meet with our expert gemologists virtually or in-person to curate the perfect piece.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-graphite/40 border border-white/10 rounded-3xl p-8 md:p-12"
        >
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">First Name</label>
                <input type="text" className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Last Name</label>
                <input type="text" className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Email Address</label>
                <input type="email" className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Phone Number</label>
                <input type="tel" className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-colors" />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Consultation Type</label>
              <select className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-colors">
                <option>Virtual Appointment</option>
                <option>In-Boutique (New York)</option>
                <option>In-Boutique (London)</option>
                <option>In-Boutique (Paris)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Message or Area of Interest</label>
              <textarea rows={4} className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-colors resize-none"></textarea>
            </div>

            <Button type="submit" variant="primary" className="w-full">Request Appointment</Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Consultation;
