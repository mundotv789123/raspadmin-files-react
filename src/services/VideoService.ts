export default class VideoService {

  setVideoTime(name: string, time: number) {
    if (time <= 0) {
      return;
    }
    const videos = localStorage['videos'] ? JSON.parse(localStorage['videos']) : {};
    const uuid = btoa(name);
    videos[uuid] = time;
    localStorage['videos'] = JSON.stringify(videos);
  }

  getVideoTime(name: string): number {
    if (!localStorage['videos']) {
      localStorage['videos'] = JSON.stringify({});
      return 0;
    }
    const videos = JSON.parse(localStorage['videos']);
    const uuid = btoa(name);
    return videos[uuid] ? videos[uuid] : 0;
  }

  async startAutoSaving(name: string, video: HTMLVideoElement) {
    if (!video || !video.src)
      return;

    this.setVideoTime(name, video.currentTime);
    setTimeout(() => {
      this.startAutoSaving(name, video);
    }, 1000);
  }

}