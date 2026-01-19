export type MultiRangeOption = { label: string; percentage: number; isOwned?: boolean };

export type MultiRangeMarket = {
  id: string;
  marketType: "multi-range";
  title: string;          // "Pro Football Champion?"
  categoryLabel: string;  // "Music" (we’ll use Music data, this is just UI)
  iconEmoji?: string;     // optional, fallback if no image
  iconUrl?: string;       // optional
  options: MultiRangeOption[]; // 3 items for now
  volumeLabel: string;    // "$104.5M Vol."
  deadlineLabel: string;  // "Feb 12, 2025 16:00"
  isOwned?: boolean;
};

export type BinaryOption = {
  id: string;
  label: string;        // option name (artist/label/etc.)
  percentage: number;   // 0-100
  score?: number;       // optional, for LIVE markets or score-like display
  iconUrl?: string;     // optional
  iconBg?: string;      // optional, default to #2A2A2A
  isOwned?: boolean;
};

export type BinaryMarket = {
  id: string;
  marketType: "binary";
  title: string;            // "Neon Dust vs Steel Pulse"
  isLive?: boolean;         // show LIVE dot + label
  livePhaseLabel?: string;  // "Q2" or "LIVE"
  liveClockLabel?: string;  // "00:00"
  options: [BinaryOption, BinaryOption];
  volumeLabel: string;      // "$88.2K Vol."
  categoryLabel: string;    // "Music"
  deadlineLabel: string;    // "Feb 12, 2026 16:00"
};
