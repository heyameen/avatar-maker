import { SETTINGS } from '@/constants';
import { AvatarOption } from '@/types';
import styles from "./style.module.scss"

interface IProps {
    avatarOption: AvatarOption
    setAvatarOption: (newOption: AvatarOption) => void
}

const ColorList = (props: IProps) => {
    const { setAvatarOption, avatarOption } = props;
    const onSwitchBgColor = (bgColor: string) => {
        if (bgColor !== avatarOption.background.color) {
            setAvatarOption({
                ...avatarOption,
                background: { ...avatarOption.background, color: bgColor },
            })
        }
    }
    return (
        <ul className={styles.colorList}>
            {
                SETTINGS.backgroundColor.map((bgColor: string) => {
                    return (
                        <li
                            key={bgColor}
                            className={styles.colorListItem}
                            onClick={() => onSwitchBgColor(bgColor)}
                        >
                            <div
                                style={{ background: bgColor }}
                                className={`${styles.bgColor} ${bgColor === avatarOption.background.color
                                    ? styles.active
                                    : bgColor === 'transparent'
                                        ? 'transparent'
                                        : ''
                                    }`}

                            />
                        </li>
                    )
                })
            }
        </ul>
    );
}

export default ColorList;