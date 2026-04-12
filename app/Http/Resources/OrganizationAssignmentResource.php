<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\OrganizationAssignment */
class OrganizationAssignmentResource extends JsonResource
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
            'full_name_snapshot' => $this->full_name_snapshot,
            'status' => $this->status?->value,
            'is_current' => $this->is_current,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->ends_at,
            'position' => $this->whenLoaded('organizationPosition', fn () => [
                'id' => $this->organizationPosition?->id,
                'title' => $this->organizationPosition?->title,
            ]),
            'unit' => $this->whenLoaded('organizationUnit', fn () => [
                'id' => $this->organizationUnit?->id,
                'name' => $this->organizationUnit?->name,
            ]),
        ];
    }
}
