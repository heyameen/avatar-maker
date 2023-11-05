import { AvatarOption } from '@/types';

interface IProps {
    avatarOption: AvatarOption
    setAvatarOption: (newOption: AvatarOption) => void
}
export default function Configurator(props: IProps) {
    const { avatarOption, setAvatarOption } = props;
    return (
        <h5>Scrollbar</h5>
    )
}
