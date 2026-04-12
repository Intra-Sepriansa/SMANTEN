<?php

namespace App\Http\Requests\Api;

use App\Enums\RoomType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoomRequest extends FormRequest
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
        $roomId = $this->route('room')?->getKey();

        return [
            'code' => ['required', 'string', 'max:255', Rule::unique('rooms', 'code')->ignore($roomId)],
            'name' => ['required', 'string', 'max:255'],
            'room_type' => ['required', Rule::enum(RoomType::class)],
            'campus_zone' => ['nullable', 'string', 'max:255'],
            'floor_level' => ['nullable', 'integer', 'min:0', 'max:20'],
            'capacity' => ['nullable', 'integer', 'min:1', 'max:1000'],
            'is_schedulable' => ['sometimes', 'boolean'],
            'supports_moving_class' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'description' => ['nullable', 'string'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
