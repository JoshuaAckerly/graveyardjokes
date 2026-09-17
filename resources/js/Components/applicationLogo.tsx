import React from 'react';

interface ApplicationLogoProps {
    logoSize?: string;
    containerClasses?: string;
}

/**
 * Graveyard Jokes wordmark emblem.
 *
 * A self-contained SVG (no external asset) so it stays crisp at every size and
 * matches the musician rebrand. Uses currentColor + the site accent variable so
 * it adapts to context. `logoSize` controls the box (height/width classes),
 * consistent with the previous image-based logo.
 */
const ApplicationLogo: React.FC<ApplicationLogoProps> = ({ logoSize = 'h-24 w-24', containerClasses = '' }) => {
    return (
        <div className={`flex ${containerClasses}`}>
            <svg
                viewBox="0 0 100 100"
                role="img"
                aria-label="Graveyard Jokes"
                className={logoSize}
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Outer ring */}
                <circle cx="50" cy="50" r="47" fill="none" stroke="var(--accent, #c9a227)" strokeWidth="2" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.75" />

                {/* Simple crescent moon mark (acoustic / nocturnal feel) */}
                <path
                    d="M56 26a16 16 0 1 0 0 30 13 13 0 0 1 0-30z"
                    fill="var(--accent, #c9a227)"
                />

                {/* Wordmark */}
                <text
                    x="50"
                    y="70"
                    textAnchor="middle"
                    fontFamily="Georgia, 'Times New Roman', serif"
                    fontSize="12"
                    letterSpacing="1.5"
                    fill="currentColor"
                    fontWeight="700"
                >
                    GRAVEYARD
                </text>
                <text
                    x="50"
                    y="84"
                    textAnchor="middle"
                    fontFamily="Georgia, 'Times New Roman', serif"
                    fontSize="12"
                    letterSpacing="4"
                    fill="var(--accent, #c9a227)"
                    fontWeight="700"
                >
                    JOKES
                </text>
            </svg>
        </div>
    );
};

export default ApplicationLogo;
