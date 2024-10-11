// utils/dateHelpers.js

export const getStartOfCurrentWeek = () => {
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(now.getDate() - dayOfWeek);
  return start;
};
