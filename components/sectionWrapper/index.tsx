import React from 'react';
import styles from './style.module.scss'

interface IProps {
    title?: string
    children: React.ReactNode
}

const SectionWrapper = (props: IProps) => {
    const { title, children } = props;
    return (
        <div className={styles.settingSection}>
            <div className={styles.sectionTitle}>{title}</div>
            <div>
                {children}
            </div>
        </div>
    )
}

export default SectionWrapper