import React from 'react';
import Image from 'next/image';
import useStore from '@/store';
import IconBack from '@/assets/icons/icon-back.svg';
import IconFlip from '@/assets/icons/icon-flip.svg';
import IconNext from '@/assets/icons/icon-next.svg';
import styles from './style.module.scss';


const ActionBar = () => {
    const { flipped, setFlipped, undo, redo, history } = useStore((state) => ({
        flipped: state.flipped,
        setFlipped: state.setFlipped,
        undo: state.undo,
        redo: state.redo,
        history: state.history,
    }));

    const canUndo = history.past.length > 0;
    const canRedo = history.future.length > 0;


    const handleActionClick = (actionType: string) => {
        switch (actionType) {
            case 'undo':
                undo();
                break;
            case 'redo':
                redo();
                break;
            case 'flip':
                setFlipped(!flipped);
                break;
            default:
        }
    };

    const actions = [
        {
            type: 'undo',
            icon: IconBack,
            tip: 'Undo',
            disabled: !canUndo,
        },
        {
            type: 'redo',
            icon: IconNext,
            tip: 'Redo',
            disabled: !canRedo,
        },
        {
            type: 'flip',
            icon: IconFlip,
            tip: 'Flip',
        },
    ];

    return (
        <div className={styles.actionMenu}>
            {actions.map((action) => (
                <div
                    key={action.type}
                    className={`${styles.menuItem} ${action.disabled ? styles.disabled : ''}`}
                    title={action.tip}
                    onClick={() => handleActionClick(action.type)}
                >
                    <Image src={action.icon} alt={action.tip} />
                </div>
            ))}
        </div>
    );
}

export default ActionBar;