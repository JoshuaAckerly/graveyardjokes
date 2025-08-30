import React from "react";

interface ApplicationLogoProps {
  logoSize?: string;
  containerClasses?: string;
}

const ApplicationLogo: React.FC<ApplicationLogoProps> = ({
  logoSize = "h-24 w-24",
  containerClasses = "",
}) => {
  const cdn = import.meta.env.VITE_ASSET_URL as string;

  return (
    <div className={`flex ${containerClasses}`}>
      <img
        src={`${cdn}/images/GraveYardJokesLogoJester.svg`}
        alt="GraveYardJokes Studios Logo"
        className={logoSize}
      />
    </div>
  );
};

export default ApplicationLogo;
