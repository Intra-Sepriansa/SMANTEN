import React, { useState } from 'react';

type FolderProps = {
    color?: string;
    size?: number;
    items?: React.ReactNode[];
    className?: string;
};

function darkenColor(hex: string, percent: number): string {
    let color = hex.startsWith('#') ? hex.slice(1) : hex;

    if (color.length === 3) {
        color = color
            .split('')
            .map((character) => character + character)
            .join('');
    }

    const num = parseInt(color, 16);
    const red = Math.max(
        0,
        Math.min(255, Math.floor(((num >> 16) & 0xff) * (1 - percent))),
    );
    const green = Math.max(
        0,
        Math.min(255, Math.floor(((num >> 8) & 0xff) * (1 - percent))),
    );
    const blue = Math.max(
        0,
        Math.min(255, Math.floor((num & 0xff) * (1 - percent))),
    );

    return `#${((1 << 24) + (red << 16) + (green << 8) + blue)
        .toString(16)
        .slice(1)
        .toUpperCase()}`;
}

export default function Folder({
    color = '#0F766E',
    size = 1,
    items = [],
    className = '',
}: FolderProps) {
    const maxItems = 3;
    const papers: Array<React.ReactNode | null> = items.slice(0, maxItems);

    while (papers.length < maxItems) {
        papers.push(null);
    }

    const [open, setOpen] = useState(false);
    const [paperOffsets, setPaperOffsets] = useState(
        Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })),
    );

    const folderBackColor = darkenColor(color, 0.08);
    const paper1 = darkenColor('#ffffff', 0.1);
    const paper2 = darkenColor('#ffffff', 0.05);
    const paper3 = '#ffffff';

    const handleClick = () => {
        setOpen((currentOpen) => !currentOpen);

        if (open) {
            setPaperOffsets(
                Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })),
            );
        }
    };

    const handlePaperMouseMove = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        if (!open) {
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const offsetX = (event.clientX - centerX) * 0.15;
        const offsetY = (event.clientY - centerY) * 0.15;

        setPaperOffsets((currentOffsets) => {
            const nextOffsets = [...currentOffsets];
            nextOffsets[index] = { x: offsetX, y: offsetY };

            return nextOffsets;
        });
    };

    const handlePaperMouseLeave = (index: number) => {
        setPaperOffsets((currentOffsets) => {
            const nextOffsets = [...currentOffsets];
            nextOffsets[index] = { x: 0, y: 0 };

            return nextOffsets;
        });
    };

    const getOpenTransform = (index: number) => {
        if (index === 0) {
            return 'translate(-120%, -70%) rotate(-15deg)';
        }

        if (index === 1) {
            return 'translate(10%, -70%) rotate(15deg)';
        }

        return 'translate(-50%, -100%) rotate(5deg)';
    };

    return (
        <div
            style={{ transform: `scale(${size})` }}
            className={className}
            aria-hidden="true"
        >
            <div
                className={`group relative cursor-pointer transition-all duration-200 ease-in ${
                    !open ? 'hover:-translate-y-2' : ''
                }`}
                style={{ transform: open ? 'translateY(-8px)' : undefined }}
                onClick={handleClick}
            >
                <div
                    className="relative h-[80px] w-[100px] rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px]"
                    style={{ backgroundColor: folderBackColor }}
                >
                    <span
                        className="absolute bottom-[98%] left-0 z-0 h-[10px] w-[30px] rounded-tl-[5px] rounded-tr-[5px]"
                        style={{ backgroundColor: folderBackColor }}
                    />

                    {papers.map((item, index) => {
                        const sizeClasses = [
                            'h-[80%] w-[70%]',
                            open ? 'h-[80%] w-[80%]' : 'h-[70%] w-[80%]',
                            open ? 'h-[80%] w-[90%]' : 'h-[60%] w-[90%]',
                        ][index];
                        const transformStyle = open
                            ? `${getOpenTransform(index)} translate(${paperOffsets[index].x}px, ${paperOffsets[index].y}px)`
                            : undefined;

                        return (
                            <div
                                key={index}
                                onMouseMove={(event) =>
                                    handlePaperMouseMove(event, index)
                                }
                                onMouseLeave={() =>
                                    handlePaperMouseLeave(index)
                                }
                                className={`absolute bottom-[10%] left-1/2 z-20 transition-all duration-300 ease-in-out ${
                                    !open
                                        ? 'transform -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0'
                                        : 'hover:scale-110'
                                } ${sizeClasses}`}
                                style={{
                                    ...(!open
                                        ? {}
                                        : { transform: transformStyle }),
                                    backgroundColor:
                                        index === 0
                                            ? paper1
                                            : index === 1
                                              ? paper2
                                              : paper3,
                                    borderRadius: '10px',
                                }}
                            >
                                {item}
                            </div>
                        );
                    })}

                    <div
                        className={`absolute z-30 h-full w-full origin-bottom transition-all duration-300 ease-in-out ${
                            !open
                                ? 'group-hover:[transform:skew(15deg)_scaleY(0.6)]'
                                : ''
                        }`}
                        style={{
                            backgroundColor: color,
                            borderRadius: '5px 10px 10px 10px',
                            ...(open && {
                                transform: 'skew(15deg) scaleY(0.6)',
                            }),
                        }}
                    />
                    <div
                        className={`absolute z-30 h-full w-full origin-bottom transition-all duration-300 ease-in-out ${
                            !open
                                ? 'group-hover:[transform:skew(-15deg)_scaleY(0.6)]'
                                : ''
                        }`}
                        style={{
                            backgroundColor: color,
                            borderRadius: '5px 10px 10px 10px',
                            ...(open && {
                                transform: 'skew(-15deg) scaleY(0.6)',
                            }),
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
