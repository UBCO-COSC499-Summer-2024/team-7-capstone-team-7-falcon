import Image from "next/image";
import React from "react";

/**
 * AvatarProps interface
 */
export interface AvatarProps {
  avatarUrl: string | undefined;
  firstName: string;
  lastName: string | undefined;
  imageWidth?: number;
  imageHeight?: number;
  imageTextWidth?: string;
  imageTextHeight?: string;
  textSize?: number;
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
  imageWidth = 96,
  imageHeight = 96,
  imageTextWidth = `w-24`,
  imageTextHeight = `h-24`,
  textSize = 2,
}: AvatarProps) => {
  return (
    <div>
      {avatarUrl && (
        <Image
          className="rounded-full"
          src={avatarUrl}
          width={imageWidth}
          height={imageHeight}
          priority
          alt={`Profile image of ${firstName} ${lastName ?? ""}`}
        />
      )}

      {!avatarUrl && (firstName || lastName) && (
        <div
          className={`bg-gray-200 ${imageTextWidth} ${imageTextHeight} rounded-full flex items-center justify-center`}
        >
          <span className={`text-gray-500 text-${textSize}xl`}>
            {firstName?.charAt(0)}
            {lastName?.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
};

export default Avatar;
