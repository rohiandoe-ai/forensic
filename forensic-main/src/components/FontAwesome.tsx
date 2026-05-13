'use client';

import type { CSSProperties } from 'react';
import { FontAwesomeIcon, type FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import type { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';
import '@/lib/fontawesome';

interface FAIconProps {
    icon: IconProp;
    className?: string;
    size?: SizeProp;
    style?: CSSProperties;
    spin?: boolean;
}

export default function FAIcon({ icon, className, size, style, spin }: FAIconProps) {
    return (
        <FontAwesomeIcon
            icon={icon}
            className={className}
            size={size}
            style={{ width: '1em', ...style } as FontAwesomeIconProps['style']}
            spin={spin}
        />
    );
}
