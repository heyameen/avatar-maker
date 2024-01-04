"use client"

import { useRef, useState } from 'react';
import { AppState, AvatarOption } from '@/types'
import Image from 'next/image';
import { getRandomAvatarOption, getSpecialAvatarOption } from '@/utils';
import { TRIGGER_PROBABILITY, NOT_COMPATIBLE_AGENTS, DOWNLOAD_DELAY } from '@/constants';
import { Header, Footer } from '@/layouts';
import Dice from '@/assets/icons/dice.svg';
import Download from '@/assets/icons/download.svg';
import styles from './style.module.scss';
import { ActionBar, Avatar } from '@/components';
import useStore from '@/store';


interface IProps {
    avatarOption: AvatarOption
    setAvatarOption: (newOption: AvatarOption) => void
}

const Container = (props: IProps) => {
    const { avatarOption, setAvatarOption } = props;
    const { flipped } = useStore((state) => ({
        flipped: state.flipped
    }));
    
    const [downloading, setDownloading] = useState(false);
    const colorAvatarRef = useRef<HTMLDivElement>(null);
    const onRandomAvatar = () => {
        if (Math.random() <= TRIGGER_PROBABILITY) {
            let colorfulOption = getSpecialAvatarOption();
            while (
                JSON.stringify(colorfulOption) === JSON.stringify(avatarOption)
            ) {
                colorfulOption = getSpecialAvatarOption();
            }
            colorfulOption.wrapperShape = avatarOption.wrapperShape;
            setAvatarOption(colorfulOption);
        } else {
            const randomOption = getRandomAvatarOption(avatarOption);
            setAvatarOption(randomOption);
        }
    }
    const onDownload = async () => {
        try {
            setDownloading(true);
            const avatarEle = colorAvatarRef.current;
            const userAgent = window.navigator.userAgent.toLowerCase();
            const notCompatible = NOT_COMPATIBLE_AGENTS.some(
                (agent) => userAgent.indexOf(agent) !== -1
            )
            if (avatarEle) {
                const html2canvas = (await import('html2canvas')).default
                const canvas = await html2canvas(avatarEle, {
                    backgroundColor: null
                })
                const dataURL = canvas.toDataURL();
                if (notCompatible) {

                } else {
                    const trigger = document.createElement('a');
                    trigger.href = dataURL;
                    trigger.download = `${name}.png`;
                    trigger.click();
                }
            }
        } finally {
            setTimeout(() => {
                setDownloading(false)
            }, DOWNLOAD_DELAY);
        }

    };

    return (
        <section className={styles.container}>
            <div className='content-wrapper'>
                <div className='content-view'>
                    <Header />
                    <div className='playground'>
                        <div className='avatar-wrapper'>
                            <Avatar
                                colorAvatarRef={colorAvatarRef}
                                option={avatarOption}
                                size={280}
                                style={{ transform: `rotateY(${flipped ? -180 : 0}deg)` }}
                            />
                        </div>

                        <ActionBar />

                        <div className='action-group'>
                            <button
                                type='button'
                                className='action-btn action-randomize'
                                onClick={onRandomAvatar}
                            >
                                <Image src={Dice} alt="Dice icon to represent randomness" height={22} width={22} />
                                <p style={{ marginLeft: ".5rem" }}>Random Avatar</p>
                            </button>

                            <button
                                type='button'
                                className='action-btn action-download'
                                onClick={onDownload}
                            >
                                <Image src={Download} alt="Download icon" height={20} width={20} />

                                {
                                    downloading
                                        ? <p style={{ marginLeft: ".5rem" }}>Downloading</p>
                                        : <p style={{ marginLeft: ".5rem" }}>Download</p>
                                }
                            </button>

                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </section>
    )
}

export default Container