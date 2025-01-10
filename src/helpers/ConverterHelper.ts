
/* get file name from url, ex: http://exemple.local/video/cool_song.mp3 -> cool_song */
export function srcToFileName(src: string): string {
    return src
        .replace(/\/+$/, '') // remove final bar (/)
        .replace(/^([a-zA-Z]+:\/\/)?\/?([^\/]+\/+)+/, '') // remove path file and url
        .replace(/\.[a-zA-Z0-9]+$/, ''); // remove extension file
}

/* convert number time to clock time, ex 75 -> 01:15 */
export function numberClockTime(time: number): string {
    const secs = time % 60;
    const min = ((time - secs) / 60) % 60;
    const hours = ((time - secs) / 60) / 60;

    let timer = `${min.toFixed(0).padStart(2, '0')}:${secs.toFixed(0).padStart(2, '0')}`;
    if (hours >= 1) {
        timer = `${hours.toFixed(0).padStart(2, '0')}:${timer}`
    }
    return timer;
}