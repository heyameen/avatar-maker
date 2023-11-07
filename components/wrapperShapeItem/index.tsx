import { SETTINGS } from '@/constants';
import { WrapperShape } from '@/enums';
import { AvatarOption } from '@/types';

import styles from './style.module.scss'

interface IProps {
    avatarOption: AvatarOption
    setAvatarOption: (newOption: AvatarOption) => void
}
const WrapperShapeItem = (props: IProps) => {
    const { setAvatarOption, avatarOption } = props;
    const onSwitchWrapperShape = (wrapperShape: WrapperShape) => {
        if (wrapperShape !== avatarOption.wrapperShape) {
            setAvatarOption({ ...avatarOption, wrapperShape })
        }
    }
    return (
        <ul className={styles.wrapperShape}>
            {
                SETTINGS.wrapperShape.map((wrapperShape: WrapperShape) => {
                    return (
                        <li
                            key={wrapperShape}
                            className={styles.wrapperShapeItem}
                            title={`wrapperShape.${wrapperShape}`}
                            onClick={() => onSwitchWrapperShape(wrapperShape)}
                        >
                            <div className={`${styles.shape} ${styles[wrapperShape]} ${wrapperShape === avatarOption.wrapperShape ? styles.active : '' }`} />
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default WrapperShapeItem