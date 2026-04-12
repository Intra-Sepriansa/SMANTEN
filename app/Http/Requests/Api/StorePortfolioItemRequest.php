<?php

namespace App\Http\Requests\Api;

use App\Enums\PortfolioVisibility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePortfolioItemRequest extends FormRequest
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
        $portfolioItemId = $this->route('portfolioItem')?->getKey();

        return [
            'portfolio_project_id' => ['required', Rule::exists('portfolio_projects', 'id')],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('portfolio_items', 'slug')->ignore($portfolioItemId)],
            'item_type' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'visibility' => ['required', Rule::enum(PortfolioVisibility::class)],
            'is_featured' => ['sometimes', 'boolean'],
            'price_estimate' => ['nullable', 'numeric', 'min:0'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
