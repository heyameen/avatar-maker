"use client"

import { useRef, useState } from 'react';
import { AvatarOption } from '@/types'
import { getRandomAvatarOption, getSpecialAvatarOption } from '@/utils';
import { TRIGGER_PROBABILITY, NOT_COMPATIBLE_AGENTS, DOWNLOAD_DELAY} from '@/constants';
import { Header, Footer } from '@/layouts';
import styles from './style.module.scss';


interface IProps {
    avatarOption: AvatarOption
    setAvatarOption: (newOption: AvatarOption) => void
}

const Container = (props: IProps) => {
    const { avatarOption, setAvatarOption } = props;
    const [flipped, setFlipped] = useState(false);
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
                            <h5>avatar</h5>avatar
                        </div>

                        <h5>action bar</h5>

                        <div className='action-group'>
                            <button
                                type='button'
                                className='action-btn action-randomize'
                                onClick={onRandomAvatar}
                            >
                                Random Avatar
                            </button>

                            <button
                                type='button'
                                className='action-btn action-download'
                                onClick={onDownload}
                            >
                                {
                                    downloading
                                        ? 'Downloading'
                                        : 'Download'
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