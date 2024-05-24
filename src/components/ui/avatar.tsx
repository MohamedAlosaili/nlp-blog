"use client";

import { cn } from "@/lib/utils";

interface AvatarProps extends React.ComponentProps<"img"> {
  size?: number;
  alt?: string;
}

export const Avatar = ({ src, size, ...props }: AvatarProps) =>
  src ? (
    <img
      {...props}
      src={src}
      height={size}
      width={size}
      className={cn("rounded-full", props.className)}
    />
  ) : (
    <AvatarFallback {...props} />
  );

export const AvatarFallback = (props: AvatarProps) => (
  <div
    {...props}
    className={cn(
      "bg-zinc-200/80 rounded-full flex items-center justify-center",
      props.className
    )}
  >
    {props.alt?.[0]}
  </div>
);
