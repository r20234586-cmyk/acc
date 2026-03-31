export const CATEGORIES = [
  { id: "all", label: "All", emoji: "✦", color: "#fff" },
  { id: "sports", label: "Sports", emoji: "⚡", color: "#FF6B35" },
  { id: "music", label: "Music", emoji: "♪", color: "#A78BFA" },
  { id: "study", label: "Study", emoji: "◈", color: "#34D399" },
  { id: "fitness", label: "Fitness", emoji: "◉", color: "#F472B6" },
  { id: "gaming", label: "Gaming", emoji: "◆", color: "#60A5FA" },
  { id: "social", label: "Social", emoji: "◎", color: "#FBBF24" },
];

export const MOCK_ACTIVITIES = [
  {
    id: 1, title: "Badminton Doubles", category: "sports",
    time: "Tomorrow, 6:00 AM", location: "YMCA Court 3", distance: "1.2 km",
    joined: 3, max: 5, host: "Arjun K.", hostAvatar: "AK",
    description: "Casual doubles game, all skill levels welcome. Bring your own racket!",
    tags: ["casual", "outdoor"], color: "#FF6B35",
    attendees: ["AK", "PR", "SM"],
  },
  {
    id: 2, title: "Jam Session – Guitar & Bass", category: "music",
    time: "Saturday, 5:00 PM", location: "Studio 7, Banjara Hills", distance: "3.4 km",
    joined: 4, max: 6, host: "Meera D.", hostAvatar: "MD",
    description: "Open jam, blues & rock vibes. Any instrument welcome. Bring your passion!",
    tags: ["blues", "rock"], color: "#A78BFA",
    attendees: ["MD", "VR", "KT", "JS"],
  },
  {
    id: 3, title: "GATE CS Study Group", category: "study",
    time: "Sunday, 10:00 AM", location: "Starbucks, Jubilee Hills", distance: "0.8 km",
    joined: 5, max: 8, host: "Priya S.", hostAvatar: "PS",
    description: "Focused study session for GATE 2025. Algorithms & OS this week.",
    tags: ["GATE", "CS"], color: "#34D399",
    attendees: ["PS", "RT", "AM", "BK", "NS"],
  },
  {
    id: 4, title: "Morning Run – 5K", category: "fitness",
    time: "Tomorrow, 6:30 AM", location: "KBR Park Entrance", distance: "2.1 km",
    joined: 7, max: 10, host: "Ravi T.", hostAvatar: "RT",
    description: "Easy 5K run around KBR. Pace: 6-7 min/km. No pressure, just vibes.",
    tags: ["running", "morning"], color: "#F472B6",
    attendees: ["RT", "AD", "SK", "PL", "MN", "GK", "DP"],
  },
  {
    id: 5, title: "Board Game Night", category: "gaming",
    time: "Friday, 7:00 PM", location: "Dice & Brew Café", distance: "4.5 km",
    joined: 4, max: 8, host: "Ananya R.", hostAvatar: "AR",
    description: "Catan, Ticket to Ride, Codenames. Snacks provided. Come solo or with friends!",
    tags: ["board games", "chill"], color: "#60A5FA",
    attendees: ["AR", "KS", "VB", "TM"],
  },
  {
    id: 6, title: "Startup Founders Meetup", category: "social",
    time: "Wednesday, 6:00 PM", location: "T-Hub, IIIT Campus", distance: "5.2 km",
    joined: 12, max: 20, host: "Kiran M.", hostAvatar: "KM",
    description: "Early stage founders + builders. Pitch, network, collaborate. Ideas welcome.",
    tags: ["startup", "tech"], color: "#FBBF24",
    attendees: ["KM", "SR", "PD", "AV", "RC", "LK", "BT", "NP"],
  },
  {
    id: 7, title: "Football – 7-a-side", category: "sports",
    time: "Sunday, 7:00 AM", location: "Gachibowli Stadium", distance: "6.8 km",
    joined: 9, max: 14, host: "Sai P.", hostAvatar: "SP",
    description: "Friendly 7-a-side. Turf booked. Bring studs or flats. Water provided.",
    tags: ["football", "weekend"], color: "#FF6B35",
    attendees: ["SP", "MK", "RT", "AJ", "LN", "GS", "KR", "PV", "DT"],
  },
  {
    id: 8, title: "Spanish Language Exchange", category: "social",
    time: "Thursday, 6:30 PM", location: "British Council Library", distance: "3.1 km",
    joined: 6, max: 10, host: "Laura V.", hostAvatar: "LV",
    description: "Practice Spanish with native speakers. All levels welcome. ¡Vamos!",
    tags: ["language", "Spanish"], color: "#FBBF24",
    attendees: ["LV", "AM", "SK", "PR", "NM", "TK"],
  },
];

export const MOCK_MESSAGES = [
  { id: 1, user: "Arjun K.", avatar: "AK", text: "Hey everyone! Court 3 is confirmed ✓", time: "2h ago", isMine: false },
  { id: 2, user: "Priya S.", avatar: "PS", text: "Perfect! I'll bring an extra shuttle", time: "1h ago", isMine: false },
  { id: 3, user: "You", avatar: "ME", text: "Should I bring water bottles?", time: "45m ago", isMine: true },
  { id: 4, user: "Arjun K.", avatar: "AK", text: "Yes please! 😊 See you all at 6!", time: "30m ago", isMine: false },
];

export const AVATAR_COLORS = {
  AK: "#FF6B35", MD: "#A78BFA", PS: "#34D399", RT: "#F472B6",
  AR: "#60A5FA", KM: "#FBBF24", SP: "#FF6B35", LV: "#34D399",
  ME: "#60A5FA", VR: "#A78BFA", SM: "#FBBF24", JS: "#F472B6",
};
