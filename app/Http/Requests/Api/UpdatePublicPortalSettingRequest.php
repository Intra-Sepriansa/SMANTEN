<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePublicPortalSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'hero' => ['required', 'array'],
            'hero.slides' => ['required', 'array', 'min:4', 'max:4'],
            'hero.slides.*.image' => ['required', 'string', 'max:255'],
            'hero.slides.*.title' => ['required', 'string', 'max:160'],
            'hero.slides.*.subtitle' => ['required', 'string', 'max:120'],
            'hero.primary_cta' => ['required', 'array'],
            'hero.primary_cta.label' => ['required', 'string', 'max:40'],
            'hero.primary_cta.href' => ['required', 'string', 'max:255'],
            'navigation' => ['required', 'array'],
            'navigation.items' => ['required', 'array', 'min:1', 'max:12'],
            'navigation.items.*.href' => ['required', 'string', 'max:255'],
            'navigation.items.*.label' => ['required', 'string', 'max:40'],
            'navigation.items.*.visible' => ['required', 'boolean'],
            'navigation.items.*.position' => ['required', 'integer', 'min:1', 'max:30'],
            'publishing' => ['nullable', 'array'],
            'publishing.status' => ['nullable', 'string', Rule::in(['draft', 'published', 'scheduled'])],
            'publishing.scheduled_at' => ['nullable', 'date'],
            'seo' => ['nullable', 'array'],
            'seo.title' => ['nullable', 'string', 'max:80'],
            'seo.description' => ['nullable', 'string', 'max:180'],
            'seo.keywords' => ['nullable', 'string', 'max:180'],
        ];
    }
}
