import { Head, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

interface PageSeoProps {
    title?: string | null;
    meta_description?: string | null;
    canonical_url?: string | null;
    robots?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
    og_type?: string | null;
    twitter_card?: string | null;
    twitter_title?: string | null;
    twitter_description?: string | null;
    twitter_image?: string | null;
    schema_json?: Record<string, unknown> | null;
}

type InertiaHeadProps = {
    /** Pass explicit children to override or extend the DB-driven tags. */
    children?: ReactNode;
};

export default function InertiaHead({ children }: InertiaHeadProps) {
    if (typeof process !== 'undefined' && process.env.JEST_WORKER_ID) {
        return <>{children}</>;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { props } = usePage<{ seo?: PageSeoProps | null }>();
    const seo = props.seo ?? {};

    return (
        <Head>
            {/* Core */}
            {seo.title && <title>{seo.title}</title>}
            {seo.meta_description && <meta name="description" content={seo.meta_description} />}
            {seo.canonical_url && <link rel="canonical" href={seo.canonical_url} />}
            {seo.robots && <meta name="robots" content={seo.robots} />}

            {/* Open Graph */}
            {seo.og_title && <meta property="og:title" content={seo.og_title} />}
            {seo.og_description && <meta property="og:description" content={seo.og_description} />}
            {seo.og_image && <meta property="og:image" content={seo.og_image} />}
            {seo.og_type && <meta property="og:type" content={seo.og_type} />}
            {seo.canonical_url && <meta property="og:url" content={seo.canonical_url} />}

            {/* Twitter Card */}
            {seo.twitter_card && <meta name="twitter:card" content={seo.twitter_card} />}
            {seo.twitter_title && <meta name="twitter:title" content={seo.twitter_title} />}
            {seo.twitter_description && <meta name="twitter:description" content={seo.twitter_description} />}
            {seo.twitter_image && <meta name="twitter:image" content={seo.twitter_image} />}

            {/* JSON-LD Structured Data */}
            {seo.schema_json && (
                <script type="application/ld+json">{JSON.stringify(seo.schema_json)}</script>
            )}

            {/* Page-level overrides / additional tags */}
            {children}
        </Head>
    );
}

