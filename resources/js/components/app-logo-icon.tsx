import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logo_clean.png"
            alt="Logo"
            className="flex size-6 items-center justify-center rounded-sm object-contain"
            {...props}
        />
    );
}
