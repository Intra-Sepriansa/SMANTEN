<?php

namespace App\Http\Requests\Api;

use App\Enums\PortfolioVisibility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreArticleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $articleId = $this->route('article')?->getKey();

        return [
            'article_category_id' => ['nullable', Rule::exists('article_categories', 'id')],
            'featured_media_asset_id' => ['nullable', Rule::exists('media_assets', 'id')],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('articles', 'slug')->ignore($articleId)],
            'excerpt' => ['nullable', 'string'],
            'body' => ['nullable', 'string'],
            'visibility' => ['required', Rule::enum(PortfolioVisibility::class)],
            'is_featured' => ['sometimes', 'boolean'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['integer', Rule::exists('tags', 'id')],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
