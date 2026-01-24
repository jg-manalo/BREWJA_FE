
export const formatSecondsToMMSS = totalSeconds => {
  if (totalSeconds == null || Number.isNaN(Number(totalSeconds))) return '—';
  const secs = Math.max(0, Math.floor(Number(totalSeconds)));
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
  