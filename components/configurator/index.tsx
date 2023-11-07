import { AvatarOption } from '@/types';
import { Scrollbar } from '@/components';

interface IProps {
    avatarOption: AvatarOption
    setAvatarOption: (newOption: AvatarOption) => void
}
const Configurator = (props: IProps) =>  {
    const { avatarOption, setAvatarOption } = props;
    return (
        <Scrollbar avatarOption={avatarOption} setAvatarOption={setAvatarOption} />
    )
}

export default Configurator;