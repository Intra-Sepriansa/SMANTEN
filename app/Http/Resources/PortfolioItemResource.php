<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\PortfolioItem */
class PortfolioItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'item_type' => $this->item_type,
            'status' => $this->status?->value,
            'visibility' => $this->visibility?->value,
            'is_featured' => $this->is_featured,
            'price_estimate' => $this->price_estimate,
            'published_at' => $this->published_at,
            'project' => $this->whenLoaded('portfolioProject', fn () => [
                'id' => $this->portfolioProject?->id,
                'title' => $this->portfolioProject?->title,
            ]),
        ];
    }
}
