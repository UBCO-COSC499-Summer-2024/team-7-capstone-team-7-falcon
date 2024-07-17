import React from "react";

interface ContentContainerProps {
  children: React.ReactNode; // The children prop includes all components that are nested within the ContentContainer component
}

/**
 * Renders a container component to hold the main content of the page
 *
 * @component
 * @param {ContentContainerProps} props
 * @returns {React.JSX.Element}
 */
const ContentContainer: React.FC<ContentContainerProps> = ({ children }) => {
  return (
    <div className="bg-gray-100 w-full">
      <div className="relative h-screen w-full rounded-l-3xl shadow-md bg-white">
        <div className="relative h-full w-full overflow-y-auto px-6 py-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ContentContainer;
