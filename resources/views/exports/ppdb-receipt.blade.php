<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bukti Pendaftaran {{ $application->registration_number }}</title>
    <style>
        @page {
            margin: 24mm;
        }

        body {
            color: #132022;
            font-family: Arial, sans-serif;
            font-size: 13px;
            line-height: 1.5;
        }

        .sheet {
            border: 1px solid #d8e2df;
            border-radius: 14px;
            padding: 28px;
        }

        .header {
            align-items: center;
            border-bottom: 2px solid #0f766e;
            display: flex;
            justify-content: space-between;
            margin-bottom: 24px;
            padding-bottom: 16px;
        }

        .eyebrow {
            color: #0f766e;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: .12em;
            text-transform: uppercase;
        }

        h1 {
            font-size: 24px;
            margin: 4px 0 0;
        }

        .number {
            background: #0f766e;
            border-radius: 10px;
            color: #fff;
            font-size: 16px;
            font-weight: 700;
            padding: 10px 14px;
        }

        .grid {
            display: grid;
            gap: 14px;
            grid-template-columns: repeat(2, 1fr);
            margin-top: 20px;
        }

        .field {
            border: 1px solid #e5ece9;
            border-radius: 10px;
            padding: 12px 14px;
        }

        .label {
            color: #607273;
            display: block;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: .08em;
            text-transform: uppercase;
        }

        .value {
            display: block;
            font-size: 15px;
            font-weight: 700;
            margin-top: 4px;
        }

        .note {
            background: #f5fbf9;
            border-radius: 10px;
            color: #436162;
            margin-top: 24px;
            padding: 14px;
        }

        .signature {
            margin-left: auto;
            margin-top: 48px;
            text-align: center;
            width: 220px;
        }

        .signature-line {
            border-top: 1px solid #132022;
            margin-top: 68px;
            padding-top: 8px;
        }

        @media print {
            .print-action {
                display: none;
            }

            .sheet {
                border: 0;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <button class="print-action" onclick="window.print()">Cetak bukti pendaftaran</button>

    <main class="sheet">
        <section class="header">
            <div>
                <span class="eyebrow">SMA Negeri 1 Tenjo</span>
                <h1>Bukti Pendaftaran PPDB</h1>
            </div>
            <div class="number">{{ $application->registration_number }}</div>
        </section>

        <section class="grid">
            <div class="field">
                <span class="label">Nama Calon Siswa</span>
                <span class="value">{{ $application->full_name }}</span>
            </div>
            <div class="field">
                <span class="label">Status</span>
                <span class="value">{{ $application->status?->value ?? $application->status }}</span>
            </div>
            <div class="field">
                <span class="label">Jalur</span>
                <span class="value">{{ $application->track_type?->value ?? $application->track_type }}</span>
            </div>
            <div class="field">
                <span class="label">Gelombang</span>
                <span class="value">{{ $application->cycle?->name ?? '-' }}</span>
            </div>
            <div class="field">
                <span class="label">NISN</span>
                <span class="value">{{ $application->nisn ?? '-' }}</span>
            </div>
            <div class="field">
                <span class="label">Sekolah Asal</span>
                <span class="value">{{ $application->previous_school_name ?? '-' }}</span>
            </div>
            <div class="field">
                <span class="label">Kontak</span>
                <span class="value">{{ $application->phone ?? $application->email ?? '-' }}</span>
            </div>
            <div class="field">
                <span class="label">Tanggal Submit</span>
                <span class="value">{{ optional($application->submitted_at)->format('d M Y H:i') ?? '-' }}</span>
            </div>
        </section>

        <p class="note">
            Simpan bukti ini untuk verifikasi berkas. Panitia dapat meminta dokumen pendukung sesuai ketentuan PPDB yang berlaku.
        </p>

        <section class="signature">
            <div>Panitia PPDB</div>
            <div class="signature-line">SMA Negeri 1 Tenjo</div>
        </section>
    </main>
</body>
</html>
