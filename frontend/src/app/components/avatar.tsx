import Image from "next/image";
import React from "react";

/**
 * AvatarProps interface
 */
export interface AvatarProps {
  avatarUrl: string | undefined;
  firstName: string;
  lastName: string | undefined;
}

/**
 * Avatar component
 * @param param0 { AvatarProps } - avatarUrl, firstName, lastName
 * @returns JSX.Element
 */
const Avatar: React.FC<AvatarProps> = ({
  avatarUrl,
  firstName,
  lastName,
}: AvatarProps) => {
  return (
    <div>
      {avatarUrl && (
        <Image
          className="rounded-full"
          src={avatarUrl}
          width={96}
          height={96}
          priority
          alt={`Profile image of ${firstName} ${lastName ?? ""}`}
        />
      )}

      {!avatarUrl && (firstName || lastName) && (
        <div className="bg-gray-200 w-24 h-24 rounded-full flex items-center justify-center">
          <span className="text-gray-500 text-2xl">
            {firstName?.charAt(0)}
            {lastName?.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
};

export default Avatar;
