<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\TimetableEntry */
class TimetableEntryResource extends JsonResource
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
            'status' => $this->status?->value,
            'notes' => $this->notes,
            'teaching_group' => $this->whenLoaded('teachingGroup', fn () => [
                'id' => $this->teachingGroup?->id,
                'name' => $this->teachingGroup?->name,
                'code' => $this->teachingGroup?->code,
            ]),
            'period' => $this->whenLoaded('timetablePeriod', fn () => [
                'id' => $this->timetablePeriod?->id,
                'name' => $this->timetablePeriod?->name,
                'day_of_week' => $this->timetablePeriod?->day_of_week,
                'sequence' => $this->timetablePeriod?->sequence,
            ]),
            'room' => $this->whenLoaded('room', fn () => [
                'id' => $this->room?->id,
                'name' => $this->room?->name,
                'code' => $this->room?->code,
            ]),
            'subject' => $this->whenLoaded('subject', fn () => [
                'id' => $this->subject?->id,
                'name' => $this->subject?->name,
                'code' => $this->subject?->code,
            ]),
            'employee' => $this->whenLoaded('employee', fn () => [
                'id' => $this->employee?->id,
                'full_name' => $this->employee?->full_name,
            ]),
        ];
    }
}
