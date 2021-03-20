
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    start: "2020-12-31", id: 74, title: "TameFes", type: "ScheduleLive"
  },
  {
    start: "2020-12-05", id: 75, title: "TameFes", type: "ScheduleLive"
  },
  {
    start: "2020-12-05", id: 76, title: "TameFes", type: "ScheduleLive"
  },
  {
    id: createEventId(),
    title: 'Live video title ABC',
    type:"declined",
    start: "2020-12-03"
  },
  {
    id: createEventId(),
    title: 'Live video title ABC',
    type:"cancelled",
    start: "2020-12-20"
  },
  {
    id: createEventId(),
    title: 'Live video title ABC',
    type:"approved",
    start: "2020-12-30"
  },{
    id: createEventId(),
    title: 'Live video title ABC',
    type:"pending",
    start: "2020-12-27"
  },
]

export function createEventId() {
  return String(eventGuid++)
}
