import React from 'react';
import { ShieldCheck, FileText, ExternalLink, Award } from 'lucide-react';
import { CertificationLab } from '@/src/types';

interface CertificationInfoProps {
  lab: CertificationLab;
  certNumber: string;
  certUrl?: string;
}

const CertificationInfo: React.FC<CertificationInfoProps> = ({ lab, certNumber, certUrl }) => {
  const getLabDescription = (labName: CertificationLab) => {
    switch (labName) {
      case CertificationLab.GIA:
        return "The Gemological Institute of America (GIA) is the world's foremost authority on diamonds, colored stones, and pearls.";
      case CertificationLab.IGI:
        return "The International Gemological Institute (IGI) is one of the largest independent gemological laboratories in the world.";
      case CertificationLab.AGS:
        return "American Gem Society (AGS) is a professional trade association of jewelers, designers, and appraisers.";
      default:
        return "This diamond has been certified by an independent gemological laboratory.";
    }
  };

  return (
    <div className="bg-graphite/40 border border-white/5 rounded-section-card overflow-hidden">
      <div className="p-8 border-b border-white/5 bg-gradient-to-r from-dark-gold/10 to-transparent">
        <div className="flex items-center gap-4 mb-2">
          <ShieldCheck className="w-6 h-6 text-bright-gold" />
          <h3 className="text-xl font-serif text-white italic">Diamond Certification</h3>
        </div>
        <p className="text-sm text-ivory/60 max-w-2xl">
          Every Veloura diamond is accompanied by a certificate from a world-renowned gemological laboratory, ensuring its authenticity and quality proportions.
        </p>
      </div>

      <div className="p-8 grid md:grid-cols-2 gap-12">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-white rounded-card flex items-center justify-center p-2 shadow-xl ring-1 ring-white/10">
              <span className="text-void font-bold text-xl">{lab}</span>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-text">Grading Authority</p>
              <p className="text-white font-serif italic text-lg">{lab === CertificationLab.GIA ? 'Gemological Institute of America' : lab === CertificationLab.IGI ? 'International Gemological Institute' : 'American Gem Society'}</p>
            </div>
          </div>
          <p className="text-sm text-ivory/70 leading-relaxed font-sans mb-8">
            {getLabDescription(lab)}
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-ivory/50">
              <Award className="w-4 h-4 text-bright-gold" />
              <span className="text-xs font-mono uppercase tracking-widest">Ethically Sourced & Conflict Free</span>
            </div>
            <div className="flex items-center gap-3 text-ivory/50">
              <ShieldCheck className="w-4 h-4 text-bright-gold" />
              <span className="text-xs font-mono uppercase tracking-widest">Lifetime Authenticity Guarantee</span>
            </div>
          </div>
        </div>

        <div className="bg-void/40 rounded-card p-6 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-muted-text mb-4">
              <FileText className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Digital Report Verification</span>
            </div>
            <div className="mb-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-text mb-1">Certificate Number</p>
              <p className="text-3xl font-sans text-white tracking-widest">{certNumber}</p>
            </div>
          </div>

          <a 
            href={certUrl || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-lg transition-all group lg:mt-12"
          >
            <span className="text-xs font-mono uppercase tracking-widest">Verify with {lab}</span>
            <ExternalLink className="w-4 h-4 text-bright-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CertificationInfo;
