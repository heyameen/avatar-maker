"use client"

import { Container, Sidebar } from '@/layouts';
import { useAvatarOption } from '@/hooks';

import './page.scss'
import "../styles/index.scss"


export default function Home() {
  const [avatarOption, setAvatarOption] = useAvatarOption();


  return (
    <main className="main">
      <Container avatarOption={avatarOption} setAvatarOption={setAvatarOption} />
      <Sidebar avatarOption={avatarOption} setAvatarOption={setAvatarOption} />
    </main>
  )
}
