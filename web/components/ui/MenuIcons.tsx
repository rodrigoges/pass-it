import React from 'react';

export const CatalogIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

export const AddItemIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
    <rect x="3" y="13" width="7" height="8" />
    <rect x="14" y="3" width="7" height="18" />
  </svg>
);

export const ProfileIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
  </svg>
);

export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
    <circle cx="7" cy="8" r="3" />
    <circle cx="17" cy="8" r="3" />
    <path d="M2 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2" />
    <path d="M14 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2" />
  </svg>
);
