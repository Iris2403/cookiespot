const base = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, focusable: false };

export const ArrowIcon = () => (<svg {...base} className="icon icon--arrow"><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const ExternalIcon = () => (<svg {...base}><path d="M14 4h6v6M10 14 20 4M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></svg>);
export const PhoneIcon = () => (<svg {...base}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>);
export const PinIcon = () => (<svg {...base}><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>);
export const ClockIcon = () => (<svg {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
export const CloseIcon = () => (<svg {...base}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const ChevronIcon = ({ dir = "right" }: { dir?: "left" | "right" }) => (<svg {...base} style={dir === "left" ? { transform: "scaleX(-1)" } : undefined}><path d="m9 6 6 6-6 6" /></svg>);
export const InstagramIcon = () => (<svg {...base}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>);
export const StarIcon = () => (<svg {...base}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z" /></svg>);
