import { useEffect, useRef, useState } from "react"

type EventHandler<T> = { func(event: T): void }["func"];

export type AudioProps = {
  onNextSong?: EventHandler<void>,
  onBackSong?: EventHandler<void>,
}

export type AudioState = {
  isLoading: boolean
  isPlaying: boolean
  errorMessage: string | null
  duration: number
  currentTime: number
}

export type AudioInfo = {
  src: string,
  volume: number,
  icon?: string,
  name?: string,
  album?: string
}

export const audioPropsDefaultValues: AudioState = {
  isLoading: true,
  isPlaying: false,
  errorMessage: null,
  duration: 0,
  currentTime: 0
}

export default function useAudioPlayer({ onNextSong, onBackSong }: AudioProps) {
  const [audioInfo, setAudioInfo] = useState<AudioInfo>();
  const [audioState, setAudioState] = useState<AudioState>(audioPropsDefaultValues);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (!audioInfo) {
      return;
    }

    if (audioRef.current.src != audioInfo.src) {
      audioRef.current.src = audioInfo.src;
      audioRef.current.currentTime = 0;
      audioRef.current.load();
      setAudioState(prev => ({ ...prev, isLoading: true, errorMessage: null }))
    }

    audioRef.current.volume = audioInfo.volume;
  }, [audioInfo]);


  function handlerCanPlay() {
    if (!audioState.isLoading) {
      return;
    }

    setAudioState(prev => ({
      ...prev,
      isLoading: false,
      duration: audioRef.current.duration,
    }));
    loadMediaSession();
  }

  function loadMediaSession() {
    if (!audioInfo) {
      return;
    }
    if (!navigator.mediaSession.metadata) {
      navigator.mediaSession.metadata = new MediaMetadata();
    }

    navigator.mediaSession.metadata.title = audioInfo?.name ?? 'song'
    if (audioInfo.name) {
      navigator.mediaSession.metadata.artwork = [{ src: audioInfo.name }];
    }


    if (audioInfo.album) {
      navigator.mediaSession.metadata.album = audioInfo.album;
    }

    navigator.mediaSession.setPositionState({
      duration: audioRef.current!.duration
    });

    navigator.mediaSession.setActionHandler("previoustrack", () => onNextSong?.());
    navigator.mediaSession.setActionHandler("nexttrack", () => onBackSong?.());
    navigator.mediaSession.setActionHandler("seekto", function (details) {
      if (details.seekTime) {
        audioRef.current!.currentTime = details.seekTime;
      }
    });
  }

  function handlerTimeUpdate() {
    setAudioState(prev => ({
      ...prev,
      isPlaying: !audioRef.current.paused,
      currentTime: audioRef.current.currentTime,
    }));
    const audioElement = audioRef.current!;
    if (audioElement.duration && audioElement.currentTime) {
      navigator.mediaSession.setPositionState({
        duration: audioElement.duration,
        playbackRate: audioElement.playbackRate,
        position: audioElement.currentTime,
      });
    }
  }

  function handlerError() {
    setAudioState(prev => ({ 
      ...prev, 
      message: audioRef.current.error?.message ?? "Ocorreu um erro ao reproduzir áudio"
    }));
  }

  function handlerEnded() {
    onNextSong?.();
  }

  function reload() {
    audioRef.current.load();
    setAudioState(prev => ({ ...prev, isLoading: true, errorMessage: null }))
  }

  audioRef.current.autoplay = true;
  audioRef.current.oncanplay = handlerCanPlay;
  audioRef.current.ontimeupdate = handlerTimeUpdate;
  audioRef.current.onerror = handlerError;
  audioRef.current.onended = handlerEnded;

  return {
    setAudioInfo: setAudioInfo,
    play: audioRef.current.play,
    pause: audioRef.current.pause,
    reload: reload,
    stop: () => {
      audioRef.current.pause();
      audioRef.current.src = '';
    },
    audioState: audioState
  }
}