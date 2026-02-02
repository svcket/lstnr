import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

interface GradientIconProps {
    size?: number;
    strokeWidth?: number;
}

export const GradientPlus = ({ size = 24, strokeWidth = 2.5 }: GradientIconProps) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Defs>
                <LinearGradient id="grad_plus" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor={COLORS.primaryGradient[0]} />
                    <Stop offset="1" stopColor={COLORS.primaryGradient[1]} />
                </LinearGradient>
            </Defs>
            <Path 
                d="M12 5v14M5 12h14" 
                stroke="url(#grad_plus)" 
                strokeWidth={strokeWidth} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
        </Svg>
    );
};
