/**
 * Shared chart configuration for SMAN 1 Tenjo — Recharts integration.
 * Provides a consistent visual language across all chart instances.
 */

export const chartColors = {
    primary: '#0d9488',      // teal-600 (school green)
    secondary: '#8b5cf6',    // violet-500
    tertiary: '#0ea5e9',     // sky-500
    quaternary: '#f59e0b',   // amber-500
    quinary: '#ec4899',      // pink-500
    senary: '#10b981',       // emerald-500
    muted: '#94a3b8',        // slate-400
    ink: '#1e293b',          // slate-800
    grid: '#e2e8f0',         // slate-200
    background: '#ffffff',

    palette: [
        '#0d9488', '#8b5cf6', '#0ea5e9', '#f59e0b',
        '#ec4899', '#10b981', '#6366f1', '#f97316',
        '#14b8a6', '#a855f7',
    ],

    gradients: {
        primary: ['#0d9488', '#065f56'],
        violet: ['#8b5cf6', '#6d28d9'],
        sky: ['#0ea5e9', '#0369a1'],
        amber: ['#f59e0b', '#d97706'],
        rose: ['#ec4899', '#be185d'],
        emerald: ['#10b981', '#059669'],
    },
} as const;

export const chartFontStyle = {
    fontFamily: 'var(--font-heading), system-ui, sans-serif',
    fontSize: 11,
    fontWeight: 600,
    fill: '#64748b',
} as const;

export const chartAxisStyle = {
    stroke: '#e2e8f0',
    strokeWidth: 1,
} as const;

export const chartTooltipStyle = {
    contentStyle: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: '16px',
        border: '1px solid rgba(226,232,240,0.8)',
        boxShadow: '0 20px 60px -20px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(12px)',
        padding: '12px 16px',
        fontFamily: 'var(--font-heading), system-ui, sans-serif',
        fontSize: '12px',
    },
    labelStyle: {
        color: '#1e293b',
        fontWeight: 700,
        marginBottom: '4px',
    },
    itemStyle: {
        color: '#64748b',
        fontWeight: 500,
    },
} as const;
