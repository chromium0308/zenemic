export type EventKind = 'planned' | 'ongoing' | 'previous';

export interface ZenEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  kind: EventKind;
  location: string;
  attendees: number;
  budget: string;
  msg: string;
}

export const EVENTS: ZenEvent[] = [
  {
    id: 'e1',
    title: "Mira's 28th Birthday",
    date: '07 Jun 2026',
    time: '7:30 PM',
    kind: 'planned',
    location: 'Sister Ray, Hackney',
    attendees: 12,
    budget: '£480',
    msg:
      "Pulling together a low-key dinner for Mira's birthday at Sister Ray in Hackney, Saturday 7th June from 7:30. Wines on me, food split evenly. RSVP yes/no by Wednesday so I can confirm the booking 🤍",
  },
  {
    id: 'e2',
    title: 'Mountain Cabin Weekend',
    date: '14-16 Jun 2026',
    time: 'Fri 4 PM',
    kind: 'planned',
    location: 'Lake District',
    attendees: 6,
    budget: '£860',
    msg:
      "Cabin trip is locked in. Driving up Friday afternoon, back Sunday evening. Cabin's £720 split 6 ways, plus shared grocery kitty. Bring waterproofs.",
  },
  {
    id: 'e3',
    title: 'Q3 Team Offsite',
    date: '24-25 Jun 2026',
    time: 'All day',
    kind: 'planned',
    location: 'Margate, Kent',
    attendees: 14,
    budget: '£3,200',
    msg:
      'Team is heading to Margate Tue-Wed for the Q3 offsite. Travel, hotel, and meals on the company card. Optional dinner at The Old Kent Market on Tue night.',
  },
  {
    id: 'e4',
    title: 'Sunday Roast at Mine',
    date: '31 May 2026',
    time: '2:00 PM',
    kind: 'ongoing',
    location: 'My flat, Bethnal Green',
    attendees: 8,
    budget: '£120',
    msg:
      'Sunday roast at mine. 2pm, doors open at 1:30. Bringing my own wine, otherwise everything covered. Reply with allergies.',
  },
  {
    id: 'e5',
    title: 'Anya & Jules Engagement',
    date: '12 Apr 2026',
    time: '6:00 PM',
    kind: 'previous',
    location: 'The Standard, Kings Cross',
    attendees: 24,
    budget: '£1,180',
    msg:
      'Engagement drinks for Anya & Jules on the rooftop at The Standard, 6pm onwards. First round on the couple, after that we split evenly. Photos in the shared album below ✨',
  },
  {
    id: 'e6',
    title: 'Run Club Brunch',
    date: '22 Mar 2026',
    time: '11:00 AM',
    kind: 'previous',
    location: 'Granger & Co, Notting Hill',
    attendees: 9,
    budget: '£260',
    msg: 'Post-half-marathon brunch at Granger & Co at 11. Booking under my name, split evenly when the bill drops.',
  },
];
