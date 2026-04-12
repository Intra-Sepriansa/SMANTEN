<?php

namespace App\Http\Requests\Api;

use App\Enums\OrganizationAssignmentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrganizationAssignmentRequest extends FormRequest
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
            'organization_unit_id' => ['nullable', Rule::exists('organization_units', 'id')],
            'organization_position_id' => ['required', Rule::exists('organization_positions', 'id')],
            'user_id' => ['nullable', 'required_without_all:employee_id,student_profile_id', Rule::exists('users', 'id')],
            'employee_id' => ['nullable', 'required_without_all:user_id,student_profile_id', Rule::exists('employees', 'id')],
            'student_profile_id' => ['nullable', 'required_without_all:user_id,employee_id', Rule::exists('student_profiles', 'id')],
            'full_name_snapshot' => ['required', 'string', 'max:255'],
            'status' => ['nullable', Rule::enum(OrganizationAssignmentStatus::class)],
            'is_current' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'biography' => ['nullable', 'string'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
