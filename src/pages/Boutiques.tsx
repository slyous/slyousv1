import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

const locations = [
  {
    city: 'Miami, Florida',
    address: '140 NE 39th St, Miami, FL 33137',
    hours: 'Mon-Sat: 11am - 8pm',
    phone: '+1 (305) 555-0987',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800'
  },
  {
    city: 'Beverly Hills, California',
    address: '468 N Rodeo Dr, Beverly Hills, CA 90210',
    hours: 'Mon-Sat: 10am - 6:30pm',
    phone: '+1 (310) 555-4321',
    image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=800'
  }
];

const otherUSLocations = [
  {
    city: 'Dallas, Texas',
    address: '8687 N Central Expy, Dallas, TX 75225',
    hours: 'Mon-Sat: 10am - 8pm',
    phone: '+1 (214) 555-1122',
    image: 'https://images.unsplash.com/photo-1582037928819-5258ee4fffca?auto=format&fit=crop&q=80&w=800'
  },
  {
    city: 'Chicago, Illinois',
    address: '700 Michigan Ave, Chicago, IL 60611',
    hours: 'Mon-Sat: 10am - 7pm',
    phone: '+1 (312) 555-5566',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'
  },
  {
    city: 'New York, New York',
    address: '150 5th Ave, New York, NY 10010',
    hours: 'Mon-Sat: 10am - 7pm',
    phone: '+1 (555) 123-4567',
    image: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&q=80&w=800'
  }
];

const internationalLocations = [
  {
    city: 'London, UK',
    address: '15 New Bond St, London W1S 3ST',
    hours: 'Mon-Sat: 10am - 6pm',
    phone: '+44 20 7123 4567',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800'
  },
  {
    city: 'Paris, France',
    address: '10 Place Vendôme, 75001 Paris',
    hours: 'Tue-Sat: 11am - 7pm',
    phone: '+33 1 23 45 67 89',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800'
  }
];

const Boutiques = () => {
  const allLocations = [...locations, ...otherUSLocations, ...internationalLocations];
  return (
    <div className="bg-void min-h-screen pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="status-label-themed inline-block mb-4">Locations</span>
          <h1 className="text-4xl font-serif text-white italic mb-4">Our Boutiques</h1>
          <p className="text-ivory/70 text-lg max-w-2xl mx-auto">Experience our collection in person at one of our global showrooms. Private consultations available by appointment.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allLocations.map((loc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-graphite/40 border border-white/5 rounded-2xl overflow-hidden group"
            >
              <div className="h-48 overflow-hidden">
                <img src={loc.image} alt={loc.city} className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-serif text-white mb-4">{loc.city}</h3>
                <div className="space-y-3 text-sm text-ivory/70 font-sans">
                  <p className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-bright-gold shrink-0 mt-1" />
                    <span>{loc.address}</span>
                  </p>
                  <p className="pl-7">{loc.hours}</p>
                  <p className="pl-7">{loc.phone}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Boutiques;
