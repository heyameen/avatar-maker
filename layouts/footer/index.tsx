import { version } from '@/package.json';
import styles from './style.module.scss'

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div
                data-message='If you are deploying to your own public website, please do not modify it unless you have permission from the original author.'
            >
                Made by {''}
                <a
                    className={styles.link}
                    href='https://ameenalade.dev/'
                    target='_blank'
                    rel='nofollow noopener noreferrer'
                >
                    Ameen
                </a>
            </div>

            <div className={styles.divider}>|</div> 
            <div className={styles.version} >{version}</div>
        </footer>
    )
}

export default Footer