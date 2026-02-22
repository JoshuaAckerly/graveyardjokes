import React from 'react';
import { getEnvVar } from '../env';

interface ApplicationLogoProps {
    logoSize?: string;
    containerClasses?: string;
}

const ApplicationLogo: React.FC<ApplicationLogoProps> = ({ logoSize = 'h-24 w-24', containerClasses = '' }) => {
    const cdn = getEnvVar('VITE_ASSET_URL');

    return (
        <div className={`flex ${containerClasses}`}>
            <img src={`${cdn}/images/GraveYardJokesLogoJester.svg`} alt="GraveYardJokes Studios Logo" className={logoSize} />
        </div>
    );
};

export default ApplicationLogo;
