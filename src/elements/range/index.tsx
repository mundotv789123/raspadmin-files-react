import { useEffect, useRef, useState } from "react";
import { Progress, ProgressBar, ProgressFollower, RangeElement } from "./styles";

export default function Range(props: { percent?: number, onInput?: ((percent: number) => boolean), follower?: boolean }) {

    const [percent, setPercent] = useState(props.percent ?? 0)
    const [followerPercent, setFollowerPercent] = useState(0)
    const [keyPressing, setKeyPressing] = useState(false)

    const progress = useRef<HTMLDivElement>();
    const progress_follower = useRef<HTMLDivElement>();

    useEffect(() => {
        if (keyPressing)
            return;
        setPercent(props.percent);
    }, [props.percent])

    function callEvent(event: any) {
        setKeyPressing(false);
        
        let perc = getCursorPercent(event);
        if (props.onInput && props.onInput(perc)) 
            setPercent(perc);
    }

    function updateProgress(event: any) {
        console.log(event)
        let kp = event.buttons == 1; 
        setKeyPressing(kp);

        let perc = getCursorPercent(event);
        if (!kp) {
            setFollowerPercent(props.follower && perc);
            return;
        }
        
        setFollowerPercent(0);
        setPercent(perc);
    }

    function getCursorPercent(event: any): number {
        let rect = progress.current.getBoundingClientRect();
        let perc = ((event.clientX - rect.left) * 100 / (rect.right - rect.left));
        if (perc < 0)
            return 0;
        if (perc > 100)
            return 100;
        return perc;
    }

    return (
        <RangeElement 
            onMouseDown={() => setKeyPressing(true)} 
            onMouseUp={callEvent} 
            onMouseMove={updateProgress}
            onMouseLeave={() => setFollowerPercent(0)}
        >
            <Progress ref={progress}>
                <ProgressBar style={{ width: `${percent}%` }} />
                <ProgressFollower
                    style={{
                        marginLeft: `-${percent}%`,
                        width: `${followerPercent}%`
                    }}
                    ref={progress_follower}
                />
            </Progress>
        </RangeElement>
    )
}