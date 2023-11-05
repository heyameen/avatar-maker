import { AvatarOption } from '@/types'
import Image from 'next/image'
import React from 'react'
import IconRight from '@/assets/icons/icon-right.svg';
import { useSideBar } from '@/hooks';
import { Configurator } from '@/components';



interface IProps {
    avatarOption: AvatarOption
    setAvatarOption: (newOption: AvatarOption) => void
}

const Sidebar = (props: IProps) => {
    const { avatarOption, setAvatarOption } = props;

    const { isCollapsed, openSidebar, closeSidebar } = useSideBar();
    return (
        <aside className={`sider ${isCollapsed ? 'collapsed' : ''}`}>

            <Configurator avatarOption={avatarOption} setAvatarOption={setAvatarOption} />

            <div className='trigger' onClick={isCollapsed ? () => openSidebar(false) : () => closeSidebar(true)}>
                <Image src={IconRight} className='icon-right' alt='arrow' />
            </div>
        </aside>
    )
}

export default Sidebar