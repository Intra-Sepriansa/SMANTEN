import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import AuthPortalLayout from '@/layouts/auth/auth-portal-layout';
import type { AuthLayoutProps } from '@/types';

export default function AuthLayout({
    variant = 'simple',
    title = '',
    description = '',
    eyebrow,
    backgroundImage,
    children,
}: AuthLayoutProps) {
    if (variant === 'portal') {
        return (
            <AuthPortalLayout
                title={title}
                description={description}
                eyebrow={eyebrow}
            >
                {children}
            </AuthPortalLayout>
        );
    }

    return (
        <AuthLayoutTemplate
            title={title}
            description={description}
            backgroundImage={backgroundImage}
        >
            {children}
        </AuthLayoutTemplate>
    );
}
