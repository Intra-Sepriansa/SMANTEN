<?php

namespace App\Services;

class PublicContentModerationService
{
    /**
     * @param  array<string, mixed>  $payload
     * @return array{score: int, status: string, notes: string|null, reasons: array<int, string>}
     */
    public function evaluateForumPost(array $payload): array
    {
        $content = implode("\n", array_filter([
            $payload['title'] ?? null,
            $payload['body'] ?? null,
            $payload['occupation_title'] ?? null,
            $payload['institution_name'] ?? null,
        ]));

        return $this->evaluate($content, isComment: false);
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array{score: int, status: string, notes: string|null, reasons: array<int, string>}
     */
    public function evaluateForumComment(array $payload): array
    {
        return $this->evaluate((string) ($payload['body'] ?? ''), isComment: true);
    }

    /**
     * @return array{score: int, status: string, notes: string|null, reasons: array<int, string>}
     */
    protected function evaluate(string $content, bool $isComment): array
    {
        $normalized = trim(preg_replace('/\s+/', ' ', $content) ?? $content);
        $score = 0;
        $reasons = [];

        if ($normalized === '') {
            return [
                'score' => 100,
                'status' => 'pending_review',
                'notes' => 'Konten kosong.',
                'reasons' => ['Konten kosong.'],
            ];
        }

        $urlMatches = preg_match_all('/(?:https?:\/\/|www\.)/i', $normalized);
        if ($urlMatches >= 1) {
            $score += 28;
            $reasons[] = 'Terdapat tautan eksternal.';
        }

        if (preg_match('/(slot|gacor|casino|judi|deposit|pinjol|whatsapp|telegram|hubungi kami)/i', $normalized)) {
            $score += 40;
            $reasons[] = 'Mengandung pola kata yang sering muncul pada spam.';
        }

        if (preg_match('/([a-z0-9])\1{7,}/i', $normalized)) {
            $score += 18;
            $reasons[] = 'Mengandung karakter yang diulang berlebihan.';
        }

        if (preg_match('/\b(\w+)(?:\W+\1){4,}\b/i', $normalized)) {
            $score += 18;
            $reasons[] = 'Mengandung pengulangan kata yang tidak natural.';
        }

        $uppercaseRatio = $this->calculateUppercaseRatio($normalized);
        if (mb_strlen($normalized) >= 24 && $uppercaseRatio >= 0.55) {
            $score += 10;
            $reasons[] = 'Dominasi huruf kapital terlalu tinggi.';
        }

        if (preg_match('/\d{8,}/', $normalized)) {
            $score += 14;
            $reasons[] = 'Mengandung deretan angka panjang.';
        }

        if ($isComment && mb_strlen($normalized) < 8) {
            $score += 12;
            $reasons[] = 'Komentar terlalu singkat untuk langsung dipublikasikan.';
        }

        if (! $isComment && mb_strlen($normalized) < 48) {
            $score += 8;
            $reasons[] = 'Cerita terlalu singkat untuk konteks alumni.';
        }

        $status = $score >= 35 ? 'pending_review' : 'approved';

        return [
            'score' => min($score, 100),
            'status' => $status,
            'notes' => $reasons === [] ? null : implode(' ', $reasons),
            'reasons' => $reasons,
        ];
    }

    protected function calculateUppercaseRatio(string $content): float
    {
        preg_match_all('/\p{Lu}/u', $content, $uppercaseMatches);
        preg_match_all('/\p{L}/u', $content, $letterMatches);

        $letters = count($letterMatches[0]);
        if ($letters === 0) {
            return 0;
        }

        return count($uppercaseMatches[0]) / $letters;
    }
}
