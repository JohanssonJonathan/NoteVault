export interface ITodoTables {
  id: string;
  created: Date;
  name: string;
  lists: {
    id: string;
    created: Date;
    items: { id: string; name: string }[];
  }[];
}

export const todoTables: ITodoTables[] = [
  // {
  //   id: '_1',
  //   created: new Date('2025-02-12T10:00:00Z'),
  //   lists: [
  //     {
  //       id: '_2',
  //       created: new Date('2025-01-01T08:00:00Z'),
  //       items: [
  //         { id: '_3', name: 'Finish report' },
  //         { id: '_4', name: 'Email client' },
  //         { id: '_5', name: 'Update website' },
  //       ],
  //     },
  //     {
  //       id: '_6',
  //       created: new Date('2025-01-15T09:00:00Z'),
  //       items: [
  //         { id: '_7', name: 'Vacuum living room' },
  //         { id: '_8', name: 'Wash dishes' },
  //         { id: '_9', name: 'Organize pantry' },
  //       ],
  //     },
  //   ],
  //   name: 'Work Tasks',
  // },
  // {
  //   id: '_10',
  //   created: new Date('2025-03-05T14:30:00Z'),
  //   lists: [
  //     {
  //       id: '_11',
  //       created: new Date('2025-02-10T11:00:00Z'),
  //       items: [
  //         { id: '_12', name: 'Buy groceries' },
  //         { id: '_13', name: 'Pick up dry cleaning' },
  //         { id: '_14', name: 'Visit bank' },
  //       ],
  //     },
  //     {
  //       id: '_15',
  //       created: new Date('2025-02-20T12:00:00Z'),
  //       items: [
  //         { id: '_16', name: 'Read book' },
  //         { id: '_17', name: 'Practice guitar' },
  //         { id: '_18', name: 'Go for a jog' },
  //       ],
  //     },
  //   ],
  //   name: 'Personal Errands',
  // },
  // {
  //   id: '_19',
  //   created: new Date('2025-01-20T08:45:00Z'),
  //   lists: [
  //     {
  //       id: '_20',
  //       created: new Date('2025-03-05T14:00:00Z'),
  //       items: [
  //         { id: '_21', name: 'Plan vacation' },
  //         { id: '_22', name: 'Book hotel' },
  //         { id: '_23', name: 'Pack luggage' },
  //       ],
  //     },
  //     {
  //       id: '_24',
  //       created: new Date('2025-03-15T15:00:00Z'),
  //       items: [
  //         { id: '_25', name: 'Water plants' },
  //         { id: '_26', name: 'Feed cat' },
  //         { id: '_27', name: 'Take out trash' },
  //       ],
  //     },
  //   ],
  //   name: 'Household Chores',
  // },
  // {
  //   id: '_28',
  //   created: new Date('2025-02-28T19:15:00Z'),
  //   lists: [
  //     {
  //       id: '_29',
  //       created: new Date('2025-04-01T16:00:00Z'),
  //       items: [
  //         { id: '_30', name: 'Write blog post' },
  //         { id: '_31', name: 'Edit video' },
  //         { id: '_32', name: 'Upload content' },
  //       ],
  //     },
  //     {
  //       id: '_33',
  //       created: new Date('2025-04-10T17:00:00Z'),
  //       items: [
  //         { id: '_34', name: 'Learn new recipe' },
  //         { id: '_35', name: 'Cook dinner' },
  //         { id: '_36', name: 'Clean kitchen' },
  //       ],
  //     },
  //   ],
  //   name: 'Creative Projects',
  // },
  // {
  //   id: '_37',
  //   created: new Date('2025-04-10T06:00:00Z'),
  //   lists: [
  //     {
  //       id: '_38',
  //       created: new Date('2025-05-01T18:00:00Z'),
  //       items: [
  //         { id: '_39', name: 'Pay bills' },
  //         { id: '_40', name: 'File taxes' },
  //         { id: '_41', name: 'Budget planning' },
  //       ],
  //     },
  //     {
  //       id: '_42',
  //       created: new Date('2025-05-15T19:00:00Z'),
  //       items: [
  //         { id: '_43', name: 'Paint room' },
  //         { id: '_44', name: 'Fix faucet' },
  //         { id: '_45', name: 'Mow lawn' },
  //       ],
  //     },
  //   ],
  //   name: 'Financial Tasks',
  // },
];
