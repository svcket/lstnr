import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

interface GradientEyeProps {
    size?: number;
}

export const GradientEye = ({ size = 24 }: GradientEyeProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor={COLORS.primaryGradient[0]} />
                    <Stop offset="1" stopColor={COLORS.primaryGradient[1]} />
                </LinearGradient>
            </Defs>
            {/* Bold Eye Shape (Filled) */}
            <Path 
                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zM12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                fill="url(#grad)"
            />
        </Svg>
    );
};
