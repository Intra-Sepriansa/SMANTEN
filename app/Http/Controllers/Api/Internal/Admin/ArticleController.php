<?php

namespace App\Http\Controllers\Api\Internal\Admin;

use App\Enums\ArticleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Services\ActivityLogService;

class ArticleController extends Controller
{
    public function __construct(
        protected ActivityLogService $activityLogService,
    ) {
    }

    public function index()
    {
        $this->authorize('viewAny', Article::class);

        return ArticleResource::collection(
            Article::query()->with(['category', 'author', 'tags'])->latest()->paginate(),
        );
    }

    public function store(StoreArticleRequest $request): ArticleResource
    {
        $this->authorize('create', Article::class);

        $article = Article::create([
            ...$request->safe()->except('tags'),
            'author_user_id' => $request->user()->getKey(),
        ]);

        $article->tags()->sync($request->validated('tags', []));

        $this->activityLogService->log($request->user(), $article, 'article.created', 'Article created.');

        return new ArticleResource($article->load(['category', 'author', 'tags']));
    }

    public function update(StoreArticleRequest $request, Article $article): ArticleResource
    {
        $this->authorize('update', $article);

        $article->update($request->safe()->except('tags'));
        $article->tags()->sync($request->validated('tags', []));

        $this->activityLogService->log($request->user(), $article, 'article.updated', 'Article updated.');

        return new ArticleResource($article->load(['category', 'author', 'tags']));
    }

    public function publish(Article $article): ArticleResource
    {
        $this->authorize('publish', $article);

        $article->update([
            'status' => ArticleStatus::Published,
            'reviewer_user_id' => request()->user()->getKey(),
            'approved_at' => now(),
            'published_at' => now(),
        ]);

        $this->activityLogService->log(request()->user(), $article, 'article.published', 'Article published.');

        return new ArticleResource($article->fresh(['category', 'author', 'tags']));
    }
}
