type ActivityItem = {
    id: string | number;
    icon: React.ReactNode;
    title: string;
    description: string;
    time: string;
};

type ActivityFeedProps = {
    items: ActivityItem[];
    emptyMessage?: string;
};

export function ActivityFeed({
    items,
    emptyMessage = 'Belum ada aktivitas terbaru.',
}: ActivityFeedProps) {
    if (items.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                    <div className="mt-0.5 flex-shrink-0 text-neutral-400">
                        {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {item.title}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {item.description}
                        </div>
                    </div>
                    <div className="flex-shrink-0 text-xs text-neutral-400">
                        {item.time}
                    </div>
                </div>
            ))}
        </div>
    );
}
