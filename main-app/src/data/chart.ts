import { ZenEvent } from './events';

export type StageKind = 'past' | 'current' | 'next';
export type StageTag = 'SETUP' | 'PRE' | 'TRAVEL' | 'LIVE' | 'KEY' | 'WRAP';

export interface Stage {
  tag: StageTag;
  t: string;
  heading: string;
  kind: StageKind;
  body: string;
}

export interface Chart {
  title: string;
  sub: string;
  stages: Stage[];
}

export const CHART_DATA: Record<string, Chart> = {
  e1: {
    title: "Mira's 28th Birthday",
    sub: 'SAT 07 JUN · 12 ATTENDEES',
    stages: [
      { tag: 'SETUP', t: 'T -2H', heading: 'Cake & playlist drop-off', kind: 'past',
        body: 'Arrive at Sister Ray to confirm the booking with Marie. Drop off the cake from Cutter & Squidge with the kitchen. Hand the bar the AUX playlist.' },
      { tag: 'PRE', t: 'T -30M', heading: 'Welcome drinks at the bar', kind: 'past',
        body: "Doors open 7:30. Greet guests at the bar; prosecco on arrival. Confirm headcount with the maître d' before sitting down." },
      { tag: 'LIVE', t: 'T +0', heading: 'Sit down for set menu', kind: 'current',
        body: 'Three courses. Pre-confirmed allergies for Sam (gluten) and Anya (vegan). Toast at the end of the starter.' },
      { tag: 'KEY', t: 'T +1.5H', heading: 'Cake & candles', kind: 'next',
        body: 'Cake out at 9:30. Kill the playlist, dim the bar lights. Get Jules to film. Vertical, please. Mira blows out, photo, then service slices.' },
      { tag: 'LIVE', t: 'T +2H', heading: 'Move to back room', kind: 'next',
        body: 'Back room booked until midnight. Bar tab opens here. First round on me, after that the splitter takes over.' },
      { tag: 'WRAP', t: 'T +4.5H', heading: 'Settle & send-off', kind: 'next',
        body: 'Settle the bill at midnight. Trigger the payment splitter via the keyboard. Confirm everyone has a way home.' },
    ],
  },
  e2: {
    title: 'Mountain Cabin Weekend',
    sub: '14-16 JUN · 6 ATTENDEES',
    stages: [
      { tag: 'SETUP', t: 'FRI · AM', heading: 'Pre-trip ops', kind: 'past',
        body: 'Confirm the cabin booking with the host. Send the grocery kitty link in the chat. Check the weather and remind everyone about waterproofs.' },
      { tag: 'TRAVEL', t: 'FRI · 4PM', heading: 'Convoy departs', kind: 'past',
        body: 'Two cars from London Bridge. Stop at Tebay for fuel and the obligatory pasty break.' },
      { tag: 'LIVE', t: 'FRI · 9PM', heading: 'Settle in', kind: 'current',
        body: 'Pick rooms (rock paper scissors for the loft). Light the fire. Order-of-the-night cocktails.' },
      { tag: 'KEY', t: 'SAT · 9AM', heading: 'Helvellyn hike', kind: 'next',
        body: 'Striding Edge route. ~7 hours. Pack lunch from the village shop. Turn around by 2pm regardless.' },
      { tag: 'LIVE', t: 'SAT · 7PM', heading: 'Cook night', kind: 'next',
        body: 'Group cook. Two teams, mains vs dessert. Wine pairing is mandatory.' },
      { tag: 'WRAP', t: 'SUN · 11AM', heading: 'Pack down', kind: 'next',
        body: 'Clean the cabin, take rubbish out. Photos uploaded to the shared album before we leave.' },
    ],
  },
  e3: {
    title: 'Q3 Team Offsite',
    sub: '24-25 JUN · 14 ATTENDEES',
    stages: [
      { tag: 'TRAVEL', t: 'TUE · 8AM', heading: 'Train from St Pancras', kind: 'past',
        body: "Group on the 08:54 to Margate. HS1 tickets in everyone's calendar invite." },
      { tag: 'LIVE', t: 'TUE · 11AM', heading: 'Welcome + Q3 retro', kind: 'past',
        body: 'Coffee at the venue, then a 90-minute retro. Anna facilitating, Marcus on notes.' },
      { tag: 'KEY', t: 'TUE · 3PM', heading: 'Strategy workshop', kind: 'current',
        body: 'Split into pods. Each pod owns one OKR. 45-min cycles with shareouts.' },
      { tag: 'LIVE', t: 'TUE · 8PM', heading: 'Dinner · Old Kent', kind: 'next',
        body: 'Set menu booked. Optional. Full team welcome but no pressure.' },
      { tag: 'KEY', t: 'WED · 9AM', heading: 'H2 planning', kind: 'next',
        body: 'Two-hour locked room: convert workshop outputs into a stack-ranked H2 plan.' },
      { tag: 'WRAP', t: 'WED · 4PM', heading: 'Train home', kind: 'next',
        body: '16:32 back to London. Recap doc shared in the train chat.' },
    ],
  },
  e4: {
    title: 'Sunday Roast at Mine',
    sub: 'TODAY · 8 ATTENDEES',
    stages: [
      { tag: 'SETUP', t: '12:30', heading: 'Brine + oven on', kind: 'past',
        body: 'Chicken in the brine since last night. Oven up to 220°C. Veg prepped. Potatoes parboiled and ready to roast in goose fat.' },
      { tag: 'PRE', t: '13:30', heading: 'Doors open', kind: 'past',
        body: "Welcome guests with prosecco and crisps. Confirm allergies. Marcus has the gluten thing, Jen's veggie (mushroom wellington in the fridge)." },
      { tag: 'LIVE', t: '14:00', heading: 'Sit down to eat', kind: 'current',
        body: 'Bring it all out at once. Sam carving the bird. Wine on the table. Top up as you go.' },
      { tag: 'KEY', t: '15:30', heading: 'Dessert & toast', kind: 'next',
        body: 'Sticky toffee pudding out. Quick toast to the housewarming officially being over.' },
      { tag: 'WRAP', t: '17:00', heading: 'Tea, settle, send-off', kind: 'next',
        body: 'Coffee + tea + leftover assignments. Trigger the splitter (€15 a head). Everyone home before sundown.' },
    ],
  },
};

export const fallbackChart = (ev: ZenEvent): Chart => ({
  title: ev.title,
  sub: `${ev.date.toUpperCase()} · ${ev.attendees} ATTENDEES`,
  stages: [
    { tag: 'SETUP', t: 'T -2H', heading: 'Pre-event setup', kind: 'past',
      body: `Arrive early at ${ev.location} to confirm bookings and set the space.` },
    { tag: 'PRE', t: 'T -30M', heading: 'Welcome', kind: 'past',
      body: 'Greet guests as they arrive. Confirm headcount.' },
    { tag: 'LIVE', t: 'T +0', heading: 'Main event begins', kind: 'current',
      body: ev.msg },
    { tag: 'KEY', t: 'T +1H', heading: 'Key moment', kind: 'next',
      body: 'The main highlight of the event.' },
    { tag: 'WRAP', t: 'T +END', heading: 'Settle & wrap', kind: 'next',
      body: 'Settle the bill via the splitter. Confirm everyone has a way home.' },
  ],
});
