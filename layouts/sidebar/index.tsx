import { AvatarOption } from '@/types'
import Image from 'next/image'
import React from 'react'
import IconRight from '@/assets/icons/icon-right.svg';
import { useSideBar } from '@/hooks';
import { Configurator } from '@/components';
import styles from './style.module.scss'




interface IProps {
    avatarOption: AvatarOption
    setAvatarOption: (newOption: AvatarOption) => void
}

const Sidebar = (props: IProps) => {
    const { avatarOption, setAvatarOption } = props;

    const { isCollapsed, openSidebar, closeSidebar } = useSideBar();
    return (
        <aside className={`${styles.sider} ${isCollapsed ? styles.collapsed : ''}`}>

            <Configurator avatarOption={avatarOption} setAvatarOption={setAvatarOption} />

            <div className={styles.trigger} onClick={isCollapsed ? () => openSidebar(false) : () => closeSidebar(true)}>
                <Image src={IconRight} className={styles.iconRight} alt='arrow' />
            </div>
        </aside>
    )
}

export default Sidebar