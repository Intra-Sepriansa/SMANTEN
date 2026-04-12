<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\TimetableVersion */
class TimetableVersionResource extends JsonResource
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
            'name' => $this->name,
            'status' => $this->status?->value,
            'effective_from' => $this->effective_from,
            'effective_until' => $this->effective_until,
            'published_at' => $this->published_at,
            'academic_term' => $this->whenLoaded('academicTerm', fn () => [
                'id' => $this->academicTerm?->id,
                'name' => $this->academicTerm?->name,
                'term_type' => $this->academicTerm?->term_type?->value,
            ]),
            'entries' => TimetableEntryResource::collection($this->whenLoaded('entries')),
        ];
    }
}
