import Image from 'next/image';
import IconGitHub from '@/assets/icons/icon-github.svg';
import styles from './style.module.scss'

const Header = () => {
    return (
        <header className={styles.header}>
            <h5>Logo</h5>

            <h2 className={styles.siteTitle}>Avatar Maker</h2>

            <div className={styles.headerRight}>
                <a
                    href='https://github.com/heyameen/avatar-maker'
                    target='_blank'
                    rel='nofollow noopener noreferrer'
                >
                    <button
                        type='button'
                        className={styles.githubButton}
                    >
                        <Image src={IconGitHub} alt='GitHub' />
                        <span className={styles.text}>GitHub</span>
                    </button>
                </a>
            </div>
        </header>
    );
};

export default Header;