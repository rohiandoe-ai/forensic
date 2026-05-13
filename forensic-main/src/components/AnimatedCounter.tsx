'use client';

import CountUp from 'react-countup';

interface AnimatedCounterProps {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

export default function AnimatedCounter({ end, duration = 2, prefix = '', suffix = '', decimals = 0 }: AnimatedCounterProps) {
    return (
        <CountUp
            end={end}
            duration={duration}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
            separator=","
        />
    );
}
