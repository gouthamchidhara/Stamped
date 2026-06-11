// Stamped design tokens — "modern passport" identity
export const T = {
  navy: '#1B2B4D',
  navyDeep: '#12203C',
  gold: '#C9A227',
  goldSoft: '#F3E9C9',
  paper: '#F5F7FA',
  card: '#FFFFFF',
  ink: '#1C2230',
  inkSoft: '#5B6478',
  line: '#E3E7EE',
  green: '#2E7D52',
  greenSoft: '#E4F2EA',
  red: '#C44536',
  redSoft: '#FAE8E5',
  blueSoft: '#E8EEF8',
  radius: 14,
  mono: 'Courier', // swap for IBM Plex Mono via expo-font later
};

export const stampStyles: Record<string, { color: string; border: string; bg: string }> = {
  review:   { color: '#946B00', border: '#D9B43B', bg: '#FBF4DC' },
  approved: { color: '#2E7D52', border: '#74B893', bg: '#E4F2EA' },
  rfe:      { color: '#C44536', border: '#DE8B80', bg: '#FAE8E5' },
  received: { color: '#1B2B4D', border: '#9DB1D6', bg: '#E8EEF8' },
};
