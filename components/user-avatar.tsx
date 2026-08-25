'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  name: string;
  image?: string;
}

export default function UserAvatar({ name, image }: UserAvatarProps) {
  const initials = name
    .trim()
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar className="h-10 w-10 border border-zinc-200">
      {image && <AvatarImage src={image} alt={name} />}

      <AvatarFallback className="bg-zinc-100 text-zinc-700 font-medium">{initials}</AvatarFallback>
    </Avatar>
  );
}
