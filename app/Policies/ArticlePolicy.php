<?php

namespace App\Policies;

use App\Enums\RoleName;
use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole([
            RoleName::SuperAdmin->value,
            RoleName::OperatorSekolah->value,
            RoleName::Guru->value,
            RoleName::JurnalisSiswa->value,
        ]);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, Article $article): bool
    {
        return $user->hasAnyRole([
            RoleName::SuperAdmin->value,
            RoleName::OperatorSekolah->value,
            RoleName::Guru->value,
        ]) || $article->author_user_id === $user->getKey();
    }

    public function publish(User $user, Article $article): bool
    {
        return $user->hasAnyRole([
            RoleName::SuperAdmin->value,
            RoleName::OperatorSekolah->value,
            RoleName::Guru->value,
        ]);
    }
}
