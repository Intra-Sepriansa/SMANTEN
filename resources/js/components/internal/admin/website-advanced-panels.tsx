import { ImagePlus, RotateCcw, Save, UploadCloud } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    AdminPanel,
    AdminSectionIntro,
} from '@/components/internal/admin/admin-workspace-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCsrfToken, jsonHeaders } from '@/lib/http';
import {
    destroy as destroyMedia,
    index as mediaIndex,
    store as storeMedia,
    update as updateMedia,
} from '@/routes/internal-api/media-assets';
import {
    index as revisionIndex,
    restore as restoreRevision,
} from '@/routes/internal-api/site-settings/public-portal/revisions';

type CmsRevision = {
    id: number;
    version: number;
    notes: string | null;
    heroTitle: string | null;
    heroSlidesCount: number;
    visibleNavigationCount: number;
    createdBy: { id: number; name: string } | null;
    createdAt: string | null;
};

type MediaAsset = {
    id: number;
    type: string | null;
    url: string | null;
    originalName: string | null;
    altText: string | null;
    visibility: string | null;
    sortOrder: number;
    crop: Record<string, number> | null;
    createdAt: string | null;
};

function formatDateTime(value: string | null): string {
    if (!value) {
        return 'Belum ada waktu';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export function CmsRevisionHistoryPanel() {
    const [revisions, setRevisions] = useState<CmsRevision[]>([]);
    const [loading, setLoading] = useState(true);
    const [restoringId, setRestoringId] = useState<number | null>(null);

    const loadRevisions = async (): Promise<void> => {
        setLoading(true);

        try {
            const response = await fetch(revisionIndex.url(), {
                credentials: 'same-origin',
                headers: { Accept: 'application/json' },
            });
            const payload = (await response.json()) as { data: CmsRevision[] };

            setRevisions(payload.data);
        } catch {
            toast.error('Riwayat revisi CMS belum bisa dimuat.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadRevisions();
    }, []);

    const restore = async (revision: CmsRevision): Promise<void> => {
        setRestoringId(revision.id);

        try {
            const response = await fetch(restoreRevision.url(revision.id), {
                method: 'POST',
                credentials: 'same-origin',
                headers: jsonHeaders(),
            });

            if (!response.ok) {
                throw new Error('Rollback konten gagal diproses.');
            }

            toast.success(
                `Konten dikembalikan dari versi ${revision.version}.`,
            );
            await loadRevisions();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Rollback konten gagal diproses.',
            );
        } finally {
            setRestoringId(null);
        }
    };

    return (
        <section className="space-y-4">
            <AdminSectionIntro
                eyebrow="Version History"
                title="Riwayat revisi dan rollback konten"
                description="Setiap simpan CMS membuat versi baru, lalu admin bisa mengembalikan versi lama tanpa menyentuh database manual."
            />

            <AdminPanel className="space-y-3">
                {loading ? (
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        Memuat riwayat revisi...
                    </div>
                ) : revisions.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                        Belum ada revisi CMS.
                    </div>
                ) : (
                    revisions.map((revision) => (
                        <div
                            key={revision.id}
                            className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-950/50"
                        >
                            <div>
                                <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                    Versi {revision.version}
                                </div>
                                <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                    {revision.heroTitle ?? 'Tanpa judul hero'} •{' '}
                                    {revision.heroSlidesCount} slide •{' '}
                                    {revision.visibleNavigationCount} menu aktif
                                </div>
                                <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                    {revision.notes ?? 'Update CMS'} oleh{' '}
                                    {revision.createdBy?.name ?? 'System'} •{' '}
                                    {formatDateTime(revision.createdAt)}
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => void restore(revision)}
                                disabled={restoringId !== null}
                            >
                                <RotateCcw className="size-4" />
                                {restoringId === revision.id
                                    ? 'Rollback...'
                                    : 'Rollback'}
                            </Button>
                        </div>
                    ))
                )}
            </AdminPanel>
        </section>
    );
}

export function MediaManagerPanel() {
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [altText, setAltText] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [crop, setCrop] = useState({
        x: '',
        y: '',
        width: '',
        height: '',
    });
    const [uploading, setUploading] = useState(false);
    const [savingId, setSavingId] = useState<number | null>(null);

    const loadAssets = async (): Promise<void> => {
        try {
            const response = await fetch(
                mediaIndex.url({
                    query: {
                        limit: 12,
                    },
                }),
                {
                    credentials: 'same-origin',
                    headers: { Accept: 'application/json' },
                },
            );
            const payload = (await response.json()) as { data: MediaAsset[] };

            setAssets(payload.data);
        } catch {
            toast.error('Media manager belum bisa dimuat.');
        }
    };

    useEffect(() => {
        void loadAssets();
    }, []);

    const upload = async (): Promise<void> => {
        if (!file) {
            toast.error('Pilih file media terlebih dahulu.');

            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('alt_text', altText);
        formData.append('visibility', visibility);

        Object.entries(crop).forEach(([key, value]) => {
            if (value !== '') {
                formData.append(`crop[${key}]`, value);
            }
        });

        try {
            const csrfToken = getCsrfToken();
            const headers = new Headers({ Accept: 'application/json' });

            if (csrfToken) {
                headers.set('X-CSRF-TOKEN', csrfToken);
            }

            const response = await fetch(storeMedia.url(), {
                method: 'POST',
                credentials: 'same-origin',
                headers,
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload media gagal diproses.');
            }

            toast.success('Media baru berhasil diunggah.');
            setFile(null);
            setAltText('');
            setCrop({ x: '', y: '', width: '', height: '' });
            await loadAssets();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Upload media gagal diproses.',
            );
        } finally {
            setUploading(false);
        }
    };

    const updateSortOrder = async (
        asset: MediaAsset,
        sortOrder: number,
    ): Promise<void> => {
        setSavingId(asset.id);

        try {
            const response = await fetch(updateMedia.url(asset.id), {
                method: 'PATCH',
                credentials: 'same-origin',
                headers: jsonHeaders(),
                body: JSON.stringify({
                    sort_order: sortOrder,
                    visibility: asset.visibility ?? 'public',
                    alt_text: asset.altText,
                }),
            });

            if (!response.ok) {
                throw new Error('Urutan media gagal disimpan.');
            }

            await loadAssets();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Urutan media gagal disimpan.',
            );
        } finally {
            setSavingId(null);
        }
    };

    const remove = async (asset: MediaAsset): Promise<void> => {
        setSavingId(asset.id);

        try {
            const response = await fetch(destroyMedia.url(asset.id), {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: jsonHeaders(),
            });

            if (!response.ok) {
                throw new Error('Media gagal diarsipkan.');
            }

            toast.success('Media dipindahkan ke arsip.');
            await loadAssets();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Media gagal diarsipkan.',
            );
        } finally {
            setSavingId(null);
        }
    };

    return (
        <section className="space-y-4">
            <AdminSectionIntro
                eyebrow="Media Manager"
                title="Upload, crop metadata, publish, dan urutkan media"
                description="Media website sekarang bisa masuk lewat admin, punya status visibility, dan menyimpan crop metadata untuk gambar."
            />

            <AdminPanel className="space-y-5">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                    <div className="grid gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
                        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
                            <UploadCloud className="size-4" />
                            Upload media
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor="media-file">File</Label>
                                <Input
                                    id="media-file"
                                    type="file"
                                    accept="image/*,video/*,.pdf"
                                    onChange={(event) =>
                                        setFile(event.target.files?.[0] ?? null)
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="media-alt">Alt text</Label>
                                <Input
                                    id="media-alt"
                                    value={altText}
                                    onChange={(event) =>
                                        setAltText(event.target.value)
                                    }
                                    placeholder="Deskripsi gambar"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="media-visibility">Status</Label>
                                <select
                                    id="media-visibility"
                                    value={visibility}
                                    onChange={(event) =>
                                        setVisibility(event.target.value)
                                    }
                                    className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                                >
                                    <option value="public">Publish</option>
                                    <option value="internal">
                                        Draft Internal
                                    </option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-4">
                            {(['x', 'y', 'width', 'height'] as const).map(
                                (key) => (
                                    <div key={key} className="grid gap-2">
                                        <Label htmlFor={`crop-${key}`}>
                                            Crop {key}
                                        </Label>
                                        <Input
                                            id={`crop-${key}`}
                                            type="number"
                                            min={0}
                                            value={crop[key]}
                                            onChange={(event) =>
                                                setCrop((current) => ({
                                                    ...current,
                                                    [key]: event.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                ),
                            )}
                        </div>

                        <Button
                            type="button"
                            onClick={() => void upload()}
                            disabled={uploading}
                            className="w-full sm:w-fit"
                        >
                            <ImagePlus className="size-4" />
                            {uploading ? 'Mengunggah...' : 'Upload media'}
                        </Button>
                    </div>

                    <div className="rounded-lg border border-dashed border-neutral-300 bg-white/70 p-4 text-sm leading-6 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-950/40 dark:text-neutral-300">
                        Format: JPG, PNG, WEBP, PDF, MP4, MOV, WEBM. Crop
                        disimpan sebagai metadata agar editor bisa mengatur
                        fokus gambar tanpa upload ulang.
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {assets.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500 md:col-span-2 xl:col-span-3 dark:border-neutral-700">
                            Belum ada media di library.
                        </div>
                    ) : (
                        assets.map((asset) => (
                            <div
                                key={asset.id}
                                className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/50"
                            >
                                {asset.url && asset.type === 'image' ? (
                                    <img
                                        src={asset.url}
                                        alt={
                                            asset.altText ??
                                            asset.originalName ??
                                            'Media'
                                        }
                                        className="h-38 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-38 items-center justify-center bg-neutral-100 text-sm font-semibold text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                                        {asset.type ?? 'media'}
                                    </div>
                                )}
                                <div className="space-y-3 p-4">
                                    <div>
                                        <div className="truncate text-sm font-semibold text-neutral-950 dark:text-white">
                                            {asset.originalName ??
                                                asset.altText ??
                                                `Media #${asset.id}`}
                                        </div>
                                        <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                            {asset.visibility ?? 'internal'} •{' '}
                                            {formatDateTime(asset.createdAt)}
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor={`sort-${asset.id}`}>
                                            Urutan galeri
                                        </Label>
                                        <Input
                                            id={`sort-${asset.id}`}
                                            type="number"
                                            min={0}
                                            defaultValue={asset.sortOrder}
                                            onBlur={(event) =>
                                                void updateSortOrder(
                                                    asset,
                                                    Number(
                                                        event.target.value,
                                                    ) || 0,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={savingId === asset.id}
                                            onClick={() =>
                                                void updateSortOrder(
                                                    asset,
                                                    asset.sortOrder,
                                                )
                                            }
                                        >
                                            <Save className="size-4" />
                                            Simpan
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={savingId === asset.id}
                                            onClick={() => void remove(asset)}
                                        >
                                            Arsip
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </AdminPanel>
        </section>
    );
}
