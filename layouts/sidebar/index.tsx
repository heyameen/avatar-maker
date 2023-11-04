import { AvatarOption } from '@/types'
import React from 'react'

interface IProps {
    avatarOption: AvatarOption
    setAvatarOption: (newOption: AvatarOption) => void
}

const Sidebar = (props: IProps) => {
    return (
        <div>Sidebar</div>
    )
}

export default Sidebar