import { AvatarOption } from '@/types';
import styles from './style.module.scss';

interface BackgroundProps {
    color: AvatarOption['background']['color']
}
export default function Background(props: BackgroundProps) {
    const { color } = props;
    return (
        <div className={styles.avatarBackground} style={{ background: color }}></div>
    )
}
