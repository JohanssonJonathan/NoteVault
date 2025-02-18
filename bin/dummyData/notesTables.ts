export interface INotesTables {
  id: string;
  created: Date;
  name: string;
  notes: {
    id: string;
    created: Date;
    title: string;
    note: string;
  }[];
}

export const notesTables: INotesTables[] = [
  // {
  //   id: '_46',
  //   created: new Date('2025-02-12T10:00:00Z'),
  //   notes: [
  //     {
  //       id: '_47',
  //       created: new Date('2025-01-01T08:00:00Z'),
  //       title: 'Meeting Notes',
  //       note: 'Discuss project timeline and deliverables.',
  //     },
  //     {
  //       id: '_48',
  //       created: new Date('2025-01-15T09:00:00Z'),
  //       title: 'Grocery List',
  //       note: 'Buy milk, eggs, bread, and coffee.',
  //     },
  //   ],
  //   name: 'Diary',
  // },
  // {
  //   id: '_49',
  //   created: new Date('2025-03-05T14:30:00Z'),
  //   notes: [
  //     {
  //       id: '_50',
  //       created: new Date('2025-02-10T11:00:00Z'),
  //       title: 'Workout Plan',
  //       note: 'Monday: Cardio, Wednesday: Strength training, Friday: Yoga.',
  //     },
  //     {
  //       id: '_51',
  //       created: new Date('2025-02-20T12:00:00Z'),
  //       title: 'Book Ideas',
  //       note: 'Outline chapters for a mystery novel.',
  //     },
  //   ],
  //   name: 'Goals',
  // },
  // {
  //   id: '_52',
  //   created: new Date('2025-01-20T08:45:00Z'),
  //   notes: [
  //     {
  //       id: '_53',
  //       created: new Date('2025-03-05T14:00:00Z'),
  //       title: 'Travel Itinerary',
  //       note: 'Day 1: Sightseeing, Day 2: Beach, Day 3: Shopping.',
  //     },
  //     {
  //       id: '_54',
  //       created: new Date('2025-03-15T15:00:00Z'),
  //       title: 'House Chores',
  //       note: 'Clean kitchen, vacuum living room, do laundry.',
  //     },
  //   ],
  //   name: 'Thoughts',
  // },
  // {
  //   id: '_55',
  //   created: new Date('2025-02-28T19:15:00Z'),
  //   notes: [
  //     {
  //       id: '_56',
  //       created: new Date('2025-04-01T16:00:00Z'),
  //       title: 'Blog Post Ideas',
  //       note: 'Write about the benefits of remote work.',
  //     },
  //     {
  //       id: '_57',
  //       created: new Date('2025-04-10T17:00:00Z'),
  //       title: 'Recipe Notes',
  //       note: 'Try a new pasta recipe with tomato basil sauce.',
  //     },
  //   ],
  //   name: 'Journal',
  // },
  // {
  //   id: '_58',
  //   created: new Date('2025-04-10T06:00:00Z'),
  //   notes: [
  //     {
  //       id: '_59',
  //       created: new Date('2025-05-01T18:00:00Z'),
  //       title: 'Financial Planning',
  //       note: 'Create a budget for the next quarter.',
  //     },
  //     {
  //       id: '_60',
  //       created: new Date('2025-05-15T19:00:00Z'),
  //       title: 'Garden Plans',
  //       note: 'Plant tomatoes, basil, and lavender in the backyard.',
  //     },
  //   ],
  //   name: 'Plans',
  // },
];
