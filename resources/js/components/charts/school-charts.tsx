import { motion } from 'framer-motion';
import type { ReactElement, ReactNode } from 'react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import {
    chartColors,
    chartFontStyle,
    chartAxisStyle,
    chartTooltipStyle,
} from '@/lib/chart-config';
import { motionViewport } from '@/lib/motion';

/* ═══════════════════ WRAPPER ═══════════════════ */

type ChartCardProps = {
    title: string;
    subtitle?: string;
    children: ReactNode;
    className?: string;
    height?: number;
};

function SafeResponsiveContainer({ children }: { children: ReactElement }) {
    return (
        <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={1}
            minHeight={1}
            initialDimension={{ width: 1, height: 1 }}
            debounce={50}
        >
            {children}
        </ResponsiveContainer>
    );
}

export function ChartCard({
    title,
    subtitle,
    children,
    className = '',
    height = 300,
}: ChartCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={motionViewport}
            transition={{ duration: 0.5 }}
            className={`rounded-4xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_-30px_rgba(15,118,110,0.15)] backdrop-blur-xl md:p-8 ${className}`}
        >
            <div className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-(--school-ink)">
                    {title}
                </h3>
                {subtitle && (
                    <p className="mt-1 text-sm text-(--school-muted)">
                        {subtitle}
                    </p>
                )}
            </div>
            <div
                className="relative min-h-48 min-w-0 overflow-hidden"
                style={{ height }}
            >
                {children}
            </div>
        </motion.div>
    );
}

/* ═══════════════════ AKADEMIK: Fasilitas Bar Chart ═══════════════════ */

type FasilitasChartProps = {
    classrooms: number;
    labs: number;
    library: number;
    rombel: number;
};

export function FasilitasBarChart({
    classrooms,
    labs,
    library,
    rombel,
}: FasilitasChartProps) {
    const data = [
        { name: 'Ruang Kelas', value: classrooms, fill: chartColors.primary },
        { name: 'Rombel', value: rombel, fill: chartColors.secondary },
        { name: 'Laboratorium', value: labs, fill: chartColors.tertiary },
        { name: 'Perpustakaan', value: library, fill: chartColors.quaternary },
    ];

    return (
        <ChartCard
            title="Kapasitas Fasilitas Akademik"
            subtitle="Perbandingan infrastruktur fisik sekolah"
        >
            <SafeResponsiveContainer>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                >
                    <CartesianGrid
                        {...chartAxisStyle}
                        horizontal={false}
                        strokeDasharray="3 3"
                    />
                    <XAxis
                        type="number"
                        tick={chartFontStyle}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ ...chartFontStyle, fontSize: 12 }}
                        width={110}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        {...(chartTooltipStyle as any)}
                        formatter={(value: number) => [`${value} unit`, '']}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28}>
                        {data.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </SafeResponsiveContainer>
        </ChartCard>
    );
}

/* ═══════════════════ AKADEMIK: Radar Kurikulum ═══════════════════ */

export function KurikulumRadarChart() {
    const data = [
        { subject: 'Diferensiasi', value: 85, fullMark: 100 },
        { subject: 'Literasi', value: 90, fullMark: 100 },
        { subject: 'Numerasi', value: 78, fullMark: 100 },
        { subject: 'Karakter', value: 92, fullMark: 100 },
        { subject: 'Praktikum', value: 75, fullMark: 100 },
        { subject: 'P5', value: 88, fullMark: 100 },
    ];

    return (
        <ChartCard
            title="Profil Kurikulum Merdeka"
            subtitle="Intensitas implementasi per dimensi pembelajaran"
        >
            <SafeResponsiveContainer>
                <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke={chartColors.grid} />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ ...chartFontStyle, fontSize: 10 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                    />
                    <Radar
                        name="Indeks"
                        dataKey="value"
                        stroke={chartColors.primary}
                        fill={chartColors.primary}
                        fillOpacity={0.25}
                        strokeWidth={2}
                    />
                    <Tooltip
                        {...(chartTooltipStyle as any)}
                        formatter={(value: number) => [`${value}%`, 'Indeks']}
                    />
                </RadarChart>
            </SafeResponsiveContainer>
        </ChartCard>
    );
}

/* ═══════════════════ ALUMNI: Distribusi Angkatan ═══════════════════ */

type AlumniAngkatanChartProps = {
    data: { year: number; count: number }[];
};

export function AlumniAngkatanChart({ data }: AlumniAngkatanChartProps) {
    const chartData = data.map((d) => ({
        name: String(d.year),
        alumni: d.count,
    }));

    return (
        <ChartCard
            title="Distribusi Alumni per Angkatan"
            subtitle="Jumlah cerita terpublikasi berdasarkan tahun kelulusan"
        >
            <SafeResponsiveContainer>
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                    <defs>
                        <linearGradient
                            id="alumniGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor={chartColors.secondary}
                                stopOpacity={0.3}
                            />
                            <stop
                                offset="95%"
                                stopColor={chartColors.secondary}
                                stopOpacity={0.02}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        {...chartAxisStyle}
                        strokeDasharray="3 3"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="name"
                        tick={chartFontStyle}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={chartFontStyle}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip
                        {...(chartTooltipStyle as any)}
                        formatter={(value: number) => [
                            `${value} cerita`,
                            'Alumni',
                        ]}
                    />
                    <Area
                        type="monotone"
                        dataKey="alumni"
                        stroke={chartColors.secondary}
                        strokeWidth={2.5}
                        fill="url(#alumniGradient)"
                        dot={{
                            r: 4,
                            fill: chartColors.secondary,
                            strokeWidth: 2,
                            stroke: '#fff',
                        }}
                        activeDot={{ r: 6, strokeWidth: 3 }}
                    />
                </AreaChart>
            </SafeResponsiveContainer>
        </ChartCard>
    );
}

/* ═══════════════════ ALUMNI: Kategori Pie ═══════════════════ */

type CategoryPieChartProps = {
    data: { name: string; value: number; color: string }[];
};

export function CategoryPieChart({ data }: CategoryPieChartProps) {
    return (
        <ChartCard
            title="Kategori Cerita"
            subtitle="Distribusi topik diskusi forum alumni"
        >
            <SafeResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="55%"
                        outerRadius="80%"
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        {...(chartTooltipStyle as any)}
                        formatter={(value: number) => [`${value} cerita`, '']}
                    />
                    <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value: string) => (
                            <span style={{ ...chartFontStyle, fontSize: 11 }}>
                                {value}
                            </span>
                        )}
                    />
                </PieChart>
            </SafeResponsiveContainer>
        </ChartCard>
    );
}

type InsightPieChartProps = {
    title: string;
    subtitle?: string;
    data: { name: string; value: number; color: string }[];
};

export function InsightPieChart({
    title,
    subtitle,
    data,
}: InsightPieChartProps) {
    return (
        <ChartCard title={title} subtitle={subtitle}>
            <SafeResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="55%"
                        outerRadius="80%"
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        {...(chartTooltipStyle as any)}
                        formatter={(value: number) => [value, '']}
                    />
                    <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value: string) => (
                            <span style={{ ...chartFontStyle, fontSize: 11 }}>
                                {value}
                            </span>
                        )}
                    />
                </PieChart>
            </SafeResponsiveContainer>
        </ChartCard>
    );
}

type DistributionBarChartProps = {
    title: string;
    subtitle?: string;
    data: { label: string; count: number }[];
};

export function DistributionBarChart({
    title,
    subtitle,
    data,
}: DistributionBarChartProps) {
    return (
        <ChartCard title={title} subtitle={subtitle}>
            <SafeResponsiveContainer>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                >
                    <CartesianGrid
                        {...chartAxisStyle}
                        horizontal={false}
                        strokeDasharray="3 3"
                    />
                    <XAxis
                        type="number"
                        tick={chartFontStyle}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="label"
                        tick={{ ...chartFontStyle, fontSize: 11 }}
                        width={150}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        {...(chartTooltipStyle as any)}
                        formatter={(value: number) => [`${value}`, 'Total']}
                    />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={22}>
                        {data.map((_, i) => (
                            <Cell
                                key={i}
                                fill={
                                    chartColors.palette[
                                        i % chartColors.palette.length
                                    ]
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </SafeResponsiveContainer>
        </ChartCard>
    );
}

/* ═══════════════════ PPDB: Kuota Jalur Pie ═══════════════════ */

type PpdbQuotaChartProps = {
    data: { track: string; percentage: number; seats: number }[];
    totalCapacity: number;
};

export function PpdbQuotaChart({ data, totalCapacity }: PpdbQuotaChartProps) {
    const pieData = data.map((d, i) => ({
        name: d.track,
        value: d.seats,
        percentage: d.percentage,
        color: chartColors.palette[i % chartColors.palette.length],
    }));

    return (
        <ChartCard
            title="Distribusi Kuota PPDB"
            subtitle={`Total kapasitas: ${totalCapacity} siswa`}
        >
            <SafeResponsiveContainer>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="45%"
                        innerRadius="50%"
                        outerRadius="78%"
                        paddingAngle={3}
                        dataKey="value"
                        label={(props: any) =>
                            `${props.name} (${props.percentage}%)`
                        }
                        labelLine={{
                            stroke: chartColors.muted,
                            strokeWidth: 1,
                        }}
                    >
                        {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        {...(chartTooltipStyle as any)}
                        formatter={(
                            value: number,
                            _name: string,
                            props: any,
                        ) => [
                            `${value} kursi (${props.payload.percentage}%)`,
                            props.payload.name,
                        ]}
                    />
                </PieChart>
            </SafeResponsiveContainer>
        </ChartCard>
    );
}

/* ═══════════════════ ADMIN: Tren Overview Line ═══════════════════ */

type AdminOverviewProps = {
    studentCount: number;
    teacherCount: number;
    articleCount: number;
    roomCount: number;
};

export function AdminOverviewChart({
    studentCount,
    teacherCount,
    articleCount,
    roomCount,
}: AdminOverviewProps) {
    const data = [
        { name: 'Siswa', value: studentCount, fill: chartColors.primary },
        { name: 'PTK', value: teacherCount, fill: chartColors.secondary },
        { name: 'Rombel', value: roomCount, fill: chartColors.tertiary },
        { name: 'Artikel', value: articleCount, fill: chartColors.quaternary },
    ];

    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
            <h3 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-white">
                Perbandingan Data Operasional
            </h3>
            <p className="mb-4 text-xs text-neutral-400">
                Snapshot realtime dari database sekolah
            </p>
            <div
                className="relative min-h-48 min-w-0 overflow-hidden"
                style={{ height: 260 }}
            >
                <SafeResponsiveContainer>
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 10, left: -15, bottom: 0 }}
                    >
                        <CartesianGrid
                            {...chartAxisStyle}
                            strokeDasharray="3 3"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            tick={chartFontStyle}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={chartFontStyle}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip {...(chartTooltipStyle as any)} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={44}>
                            {data.map((entry, i) => (
                                <Cell key={i} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </SafeResponsiveContainer>
            </div>
        </div>
    );
}

/* ═══════════════════ PROFIL: Pilar Sekolah Radar ═══════════════════ */

export function ProfilPilarRadar() {
    const data = [
        { pillar: 'Prestasi', score: 85 },
        { pillar: 'Karakter', score: 92 },
        { pillar: 'IPTEK', score: 78 },
        { pillar: 'Lingkungan', score: 80 },
        { pillar: 'Daya Saing', score: 70 },
    ];

    return (
        <ChartCard
            title="Indeks Pilar Sekolah"
            subtitle="Penilaian komposit berdasarkan 5 pilar utama pendidikan"
        >
            <SafeResponsiveContainer>
                <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke={chartColors.grid} />
                    <PolarAngleAxis
                        dataKey="pillar"
                        tick={{ ...chartFontStyle, fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                    />
                    <Radar
                        name="Indeks"
                        dataKey="score"
                        stroke={chartColors.primary}
                        fill={chartColors.primary}
                        fillOpacity={0.2}
                        strokeWidth={2.5}
                        dot={{
                            r: 4,
                            fill: chartColors.primary,
                            strokeWidth: 2,
                            stroke: '#fff',
                        }}
                    />
                    <Tooltip
                        {...(chartTooltipStyle as any)}
                        formatter={(value: number) => [`${value}/100`, 'Skor']}
                    />
                </RadarChart>
            </SafeResponsiveContainer>
        </ChartCard>
    );
}

/* ═══════════════════ GURU: Distribusi per Bidang ═══════════════════ */

type GuruDistributionProps = {
    data: { unit: string; count: number }[];
};

export function GuruDistributionChart({ data }: GuruDistributionProps) {
    return (
        <ChartCard
            title="Distribusi Guru per Bidang"
            subtitle="Jumlah tenaga pendidik aktif berdasarkan unit/divisi"
        >
            <SafeResponsiveContainer>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                >
                    <CartesianGrid
                        {...chartAxisStyle}
                        horizontal={false}
                        strokeDasharray="3 3"
                    />
                    <XAxis
                        type="number"
                        tick={chartFontStyle}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="unit"
                        tick={{ ...chartFontStyle, fontSize: 11 }}
                        width={130}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        {...(chartTooltipStyle as any)}
                        formatter={(value: number) => [`${value} guru`, '']}
                    />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={22}>
                        {data.map((_, i) => (
                            <Cell
                                key={i}
                                fill={
                                    chartColors.palette[
                                        i % chartColors.palette.length
                                    ]
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </SafeResponsiveContainer>
        </ChartCard>
    );
}

/* ═══════════════════ HOME: Mini Sparkline ═══════════════════ */

type SparklineChartProps = {
    data: number[];
    color?: string;
    height?: number;
};

export function SparklineChart({
    data,
    color = chartColors.primary,
    height = 40,
}: SparklineChartProps) {
    const chartData = data.map((v, i) => ({ i, v }));

    return (
        <div
            className="relative min-h-4 min-w-0 overflow-hidden"
            style={{ width: '100%', height }}
        >
            <SafeResponsiveContainer>
                <AreaChart
                    data={chartData}
                    margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
                >
                    <defs>
                        <linearGradient
                            id={`sparkGrad-${color.replace('#', '')}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor={color}
                                stopOpacity={0.3}
                            />
                            <stop
                                offset="100%"
                                stopColor={color}
                                stopOpacity={0.02}
                            />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="v"
                        stroke={color}
                        strokeWidth={2}
                        fill={`url(#sparkGrad-${color.replace('#', '')})`}
                        dot={false}
                    />
                </AreaChart>
            </SafeResponsiveContainer>
        </div>
    );
}
