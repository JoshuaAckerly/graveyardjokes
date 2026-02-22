import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';

type InertiaHeadProps = {
    children?: ReactNode;
    [key: string]: unknown;
};

export default function InertiaHead({ children, ...props }: InertiaHeadProps) {
    if (typeof process !== 'undefined' && process.env.JEST_WORKER_ID) {
        return <>{children}</>;
    }

    return <Head {...props}>{children}</Head>;
}
