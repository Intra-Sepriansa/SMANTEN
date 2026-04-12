<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Room */
class RoomResource extends JsonResource
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
            'code' => $this->code,
            'name' => $this->name,
            'room_type' => $this->room_type?->value,
            'campus_zone' => $this->campus_zone,
            'capacity' => $this->capacity,
            'is_schedulable' => $this->is_schedulable,
            'supports_moving_class' => $this->supports_moving_class,
            'is_active' => $this->is_active,
            'description' => $this->description,
        ];
    }
}
