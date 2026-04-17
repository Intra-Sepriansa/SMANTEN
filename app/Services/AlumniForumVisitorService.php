<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AlumniForumVisitorService
{
    public function resolveClientToken(Request $request): string
    {
        $candidate = $request->header('X-Alumni-Visitor')
            ?? $request->cookie('alumni_forum_visitor');

        if (is_string($candidate) && $this->isValidClientToken($candidate)) {
            return $candidate;
        }

        return 'visitor-'.Str::uuid()->toString();
    }

    public function hashToken(string $token): string
    {
        return hash('sha256', $token);
    }

    protected function isValidClientToken(string $token): bool
    {
        return Str::length($token) >= 12
            && Str::length($token) <= 120
            && preg_match('/^[A-Za-z0-9:_\-\.]+$/', $token) === 1;
    }
}
