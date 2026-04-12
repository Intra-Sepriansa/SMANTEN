<?php

namespace App\Http\Requests\Api;

use App\Enums\TimetableEntryStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTimetableEntryRequest extends FormRequest
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
        return [
            'timetable_version_id' => ['required', Rule::exists('timetable_versions', 'id')],
            'teaching_group_id' => ['required', Rule::exists('teaching_groups', 'id')],
            'timetable_period_id' => ['required', Rule::exists('timetable_periods', 'id')],
            'room_id' => ['required', Rule::exists('rooms', 'id')],
            'subject_id' => ['required', Rule::exists('subjects', 'id')],
            'employee_id' => ['required', Rule::exists('employees', 'id')],
            'original_entry_id' => ['nullable', Rule::exists('timetable_entries', 'id')],
            'status' => ['nullable', Rule::enum(TimetableEntryStatus::class)],
            'notes' => ['nullable', 'string'],
        ];
    }
}
