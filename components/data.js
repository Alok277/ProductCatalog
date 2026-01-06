export const vennData = [
  { sets: ["A"], size: 1200 },
  { sets: ["B"], size: 900 },
  { sets: ["C"], size: 700 },

  { sets: ["A", "B"], size: 600 },
  { sets: ["A", "C"], size: 500 },
  { sets: ["B", "C"], size: 400 },

  { sets: ["A", "B", "C"], size: 300 },
];

export const nestedCirclesData = {
  outer: {
    name: "ALL USERS",
    size: 12000,
  },

  inner: [
    {
      name: "Segment 1",
      size: 10345,
      relatedTo: ["Segment 2", "Segment 3", "Segment 4"],
      intersectsWith: ["Segment 2", "Segment 3"],
      intersectionSize: 4345,
    },
    {
      name: "Segment 2",
      size: 8566,
      relatedTo: ["Segment 1", "Segment 3", "Segment 5"],
      intersectsWith: ["Segment 1", "Segment 4"],
      intersectionSize: 3567,
    },
    {
      name: "Segment 3",
      size: 2355,
      relatedTo: ["Segment 1", "Segment 2", "Segment 6"],
      intersectsWith: ["Segment 1", "Segment 2"],
      intersectionSize: 1234,
    },
    {
      name: "Segment 4",
      size: 14567,
      relatedTo: ["Segment 1", "Segment 5", "Segment 7"],
      intersectsWith: ["Segment 2", "Segment 8"],
      intersectionSize: 2890,
    },
    {
      name: "Segment 5",
      size: 6789,
      relatedTo: ["Segment 2", "Segment 4", "Segment 9"],
      intersectsWith: ["Segment 6", "Segment 10"],
      intersectionSize: 1987,
    },
    {
      name: "Segment 6",
      size: 4567,
      relatedTo: ["Segment 3", "Segment 7", "Segment 10"],
      intersectsWith: ["Segment 5"],
      intersectionSize: 876,
    },
    {
      name: "Segment 7",
      size: 12345,
      relatedTo: ["Segment 4", "Segment 8"],
      intersectsWith: ["Segment 9"],
      intersectionSize: 2345,
    },
    {
      name: "Segment 8",
      size: 7890,
      relatedTo: ["Segment 7", "Segment 9", "Segment 10"],
      intersectsWith: ["Segment 4"],
      intersectionSize: 1567,
    },
    {
      name: "Segment 9",
      size: 3456,
      relatedTo: ["Segment 5", "Segment 7"],
      intersectsWith: ["Segment 8", "Segment 10"],
      intersectionSize: 987,
    },
    {
      name: "Segment 10",
      size: 5678,
      relatedTo: ["Segment 6", "Segment 8", "Segment 9"],
      intersectsWith: ["Segment 5"],
      intersectionSize: 1456,
    },
  ],

  tripleIntersections: [
    { sets: ["Segment 1", "Segment 2", "Segment 3"], size: 4345 },
  ],
};
