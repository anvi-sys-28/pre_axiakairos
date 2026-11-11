import React from 'react';
import { CobaltFlareFooter } from './CobaltFlareFooter';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <CobaltFlareFooter
        brandName="axiakairos"
        copyrightName="Axia Kairos Advisory & Technology Group"
      />
    </div>
  );
};

export default Footer;
