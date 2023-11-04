"use client"

import { Container, Sidebar } from '@/layouts';
import { useAvatarOption } from '@/hooks';

import styles from './page.module.scss'
import "../styles/index.scss"


export default function Home() {
  const [avatarOption, setAvatarOption] = useAvatarOption();


  return (
    <main className={styles.main}>
      <Container avatarOption={avatarOption} setAvatarOption={setAvatarOption} />
      <Sidebar avatarOption={avatarOption} setAvatarOption={setAvatarOption} />
    </main>
  )
}
