<?php

namespace App\Modules\Authorization\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
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
        $roleId = $this->route('role')->id;

        return [
            'name' => 'nullable|string|max:255|unique:roles,name,' . $roleId,
            'slug' => 'nullable|string|max:255|unique:roles,slug,' . $roleId . '|regex:/^[a-z0-9-]+$/',
            'description' => 'nullable|string',
            'level' => 'nullable|integer|min:1',
        ];
    }
}
