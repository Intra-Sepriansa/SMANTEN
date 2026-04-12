<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\PpdbApplication */
class PpdbApplicationResource extends JsonResource
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
            'registration_number' => $this->registration_number,
            'track_type' => $this->track_type?->value,
            'status' => $this->status?->value,
            'full_name' => $this->full_name,
            'distance_meters' => $this->distance_meters,
            'distance_calculated_at' => $this->distance_calculated_at,
            'submitted_at' => $this->submitted_at,
            'verified_at' => $this->verified_at,
            'decided_at' => $this->decided_at,
            'decision_notes' => $this->decision_notes,
            'cycle' => $this->whenLoaded('cycle', fn () => [
                'id' => $this->cycle?->id,
                'name' => $this->cycle?->name,
            ]),
            'documents' => $this->whenLoaded('documents', fn () => $this->documents->map(fn ($document) => [
                'id' => $document->id,
                'document_type' => $document->document_type,
                'status' => $document->status?->value,
            ])),
        ];
    }
}
