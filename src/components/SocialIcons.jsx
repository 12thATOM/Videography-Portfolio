import React from 'react';
import { Mail, Globe } from 'lucide-react';

export const InstagramIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export const SocialIcon = ({ name, size = 18, className = "" }) => {
  switch (name?.toLowerCase()) {
    case 'instagram': return <InstagramIcon size={size} className={className} />;
    case 'email':
    case 'mail': return <Mail size={size} className={className} />;
    default: return <Globe size={size} className={className} />;
  }
};
