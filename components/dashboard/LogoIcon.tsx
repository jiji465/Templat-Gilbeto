import React from 'react';

interface LogoIconProps {
    size?: number;
}

export function LogoIcon({ size = 40 }: LogoIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Gradientes dourados */}
            <defs>
                <linearGradient id="goldBar1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f0c040" />
                    <stop offset="50%" stopColor="#c9a227" />
                    <stop offset="100%" stopColor="#8a6e10" />
                </linearGradient>
                <linearGradient id="goldBar2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f5ce55" />
                    <stop offset="50%" stopColor="#c9a227" />
                    <stop offset="100%" stopColor="#7a5e08" />
                </linearGradient>
                <linearGradient id="goldBar3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fcd96a" />
                    <stop offset="50%" stopColor="#d4ad30" />
                    <stop offset="100%" stopColor="#9a7a18" />
                </linearGradient>
                <linearGradient id="arrowGrad" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#d0d0d0" />
                    <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
                {/* Brilho lateral das barras */}
                <linearGradient id="shineLeft" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
            </defs>

            {/* Barra 1 — menor, esquerda */}
            <rect x="22" y="50" width="18" height="35" rx="3" fill="url(#goldBar1)" />
            {/* Brilho barra 1 */}
            <rect x="22" y="50" width="6" height="35" rx="3" fill="url(#shineLeft)" />

            {/* Barra 2 — média, centro */}
            <rect x="46" y="30" width="18" height="55" rx="3" fill="url(#goldBar2)" />
            {/* Brilho barra 2 */}
            <rect x="46" y="30" width="6" height="55" rx="3" fill="url(#shineLeft)" />

            {/* Barra 3 — maior, direita */}
            <rect x="70" y="10" width="18" height="75" rx="3" fill="url(#goldBar3)" />
            {/* Brilho barra 3 */}
            <rect x="70" y="10" width="6" height="75" rx="3" fill="url(#shineLeft)" />

            {/* Linha da seta (V drop + diagonal) */}
            <path
                d="M 12 55 L 12 85 L 90 28"
                fill="none"
                stroke="url(#arrowGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Ponta da seta */}
            <path
                d="M 74 28 L 90 28 L 84 43"
                fill="none"
                stroke="url(#arrowGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
