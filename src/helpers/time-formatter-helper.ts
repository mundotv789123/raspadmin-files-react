export function formatSecondsToTime(seconds: number, showHours: boolean = false) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  if (minutes < 60) {
    const formattedMinutes = minutes < 10 && showHours? `0${minutes}` : `${minutes}`;
    return `${showHours ? '00:' : ''}${formattedMinutes}:${formattedSeconds}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes =  Math.floor(minutes % 60);
  const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;
  return `${hours}:${formattedMinutes}:${formattedSeconds}`;
}