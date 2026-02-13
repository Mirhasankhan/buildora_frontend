export const timeToMinutes = (time: string) => {
  const [hms, ampm] = time.split(" ");
  const [h, m] = hms.split(":").map(Number);
  let hour = h % 12;
  if (ampm === "PM") hour += 12;
  return hour * 60 + m;
};

// Check if two time ranges overlap
export const isOverlap = (
  startA: string,
  endA: string,
  startB: string,
  endB: string
) => {
  const sA = timeToMinutes(startA);
  const eA = timeToMinutes(endA);
  const sB = timeToMinutes(startB);
  const eB = timeToMinutes(endB);
  return sA < eB && sB < eA; // strict overlap check
};


export const generateTimeOptions = () => {
  const arr: string[] = [];
  const format = (h: number, m: number) => {
    const hour = ((h + 11) % 12) + 1;
    const ampm = h >= 12 ? "PM" : "AM";
    const min = m === 0 ? "00" : m;
    return `${hour}:${min} ${ampm}`;
  };
  for (let h = 0; h < 24; h++) {
    arr.push(format(h, 0));
    arr.push(format(h, 30));
  }
  return arr;
};