import { useState } from "react";
import avatarPlaceholder from "@/assets/user-avatar-backoffice-placeholder.svg";

export function UserAvatar({ photo }: { photo?: string | null }) {
  const [onErrorImg, setOnErrorImg] = useState(false);

  const mostrarImagem = photo && !onErrorImg;

  return mostrarImagem ? (
    <img
      src={photo}
      className="block h-full w-full rounded-full object-cover"
      onError={() => setOnErrorImg(true)}
      alt="Foto do utilizador"
    />
  ) : (
    <img
      src={avatarPlaceholder}
      className="block h-full w-full rounded-full object-cover"
      alt=""
      aria-hidden="true"
    />
  );
}
