import { SETTINGS } from '@/constants';
import { AvatarOption } from '@/types';
import styles from "./style.module.scss"
import { useEffect, useState } from 'react';
import { getRandomValue } from '@/utils';

interface IProps {
    avatarOption: AvatarOption
    setAvatarOption: (newOption: AvatarOption) => void
}

const ColorList = (props: IProps) => {
    const { setAvatarOption, avatarOption } = props;
    const [selectedBgColor, setSelectedBgColor] = useState<string>(avatarOption.background.color);


    const onSwitchBgColor = (bgColor: string) => {
        if (bgColor !== selectedBgColor) {
            setAvatarOption({
                ...avatarOption,
                background: { ...avatarOption.background, color: bgColor }
            })
            setSelectedBgColor(bgColor);
        }
    }


    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         const randomBgColor = getRandomValue(SETTINGS.backgroundColor)
    //         setSelectedBgColor(randomBgColor);
    //     }
    // }, []);


    return (
        <ul className={styles.colorList}>
            {
                SETTINGS.backgroundColor.map((bgColor: string, i:number) => {
                    return (
                        <li
                            key={bgColor}
                            className={styles.colorListItem}
                        >
                            <div
                                style={{ background: bgColor }}
                                className={
                                    `${styles.bgColor} ${bgColor === selectedBgColor ?
                                    styles.active : bgColor === 'transparent' ?
                                            'transparent' : ''}`
                                }
                                onClick={() => onSwitchBgColor(bgColor)}
                            />
                        </li>
                    )
                })
            }
        </ul>
    );
}

export default ColorList;