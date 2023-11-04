"use client"
import useStore from "@/store";

export default function useAvatarOption() {
  const avatarOption = useStore((state) => state.history.present);

  const setAvatarOption = useStore((state) => state.setAvatarOption);

  return [avatarOption, setAvatarOption] as const;
}
