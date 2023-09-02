import md5 from "md5";

export default class VideoService {

    setVideoTime(name: string, time: number) {
        if (time <= 0) {
            return;
        }
        let videos = localStorage['videos'] ? JSON.parse(localStorage['videos']) : {};
        let uuid = md5(name);
        videos[uuid] = time;
        localStorage['videos'] = JSON.stringify(videos);
    }

    getVideoTime(name: string): number {
        if (!localStorage['videos']) {
            localStorage['videos'] = JSON.stringify({});
            return 0;
        }
        let videos = JSON.parse(localStorage['videos']);
        let uuid = md5(name);
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