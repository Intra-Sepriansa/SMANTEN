<?php

namespace App\Http\Requests\Api;

use App\Enums\PpdbTrackType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubmitPpdbApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ppdb_cycle_id' => ['required', Rule::exists('ppdb_cycles', 'id')],
            'track_type' => ['required', Rule::enum(PpdbTrackType::class)],
            'full_name' => ['required', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'max:20'],
            'nisn' => ['nullable', 'string', 'max:50'],
            'phone' => ['nullable', 'string', 'max:32'],
            'email' => ['nullable', 'email', 'max:255'],
            'previous_school_name' => ['nullable', 'string', 'max:255'],
            'address_line' => ['nullable', 'string'],
            'village' => ['nullable', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'province' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:12'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'ketm_flag' => ['sometimes', 'boolean'],
            'special_condition_flag' => ['sometimes', 'boolean'],
            'achievements_summary' => ['nullable', 'string'],
            'submission_payload' => ['nullable', 'array'],
        ];
    }
}
