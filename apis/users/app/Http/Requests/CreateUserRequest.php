<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Types\Users\CreateUserDto;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request for creating a user
 *
 * Handles HTTP validation and converts to auto-generated DTO
 */
class CreateUserRequest extends FormRequest
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
     */
    public function rules(): array
    {
        // Get shared config (cached at boot time)
        $config = app('shared.fields');

        return [
            'document' => [
                'required',
                'string',
                "max:{$config['DOCUMENT_MAX_LENGTH']}",
                'unique:users,document'
            ],
            'name' => [
                'required',
                'string',
                "max:{$config['NAME_MAX_LENGTH']}"
            ],
            'email' => [
                'required',
                'email',
                "max:{$config['EMAIL_MAX_LENGTH']}",
            ],
            'cellphone' => [
                'required',
                'string',
                "max:{$config['CELLPHONE_MAX_LENGTH']}"
            ],
        ];
    }

    /**
     * Get the validated data as auto-generated DTO
     */
    public function toDto(): CreateUserDto
    {
        return new CreateUserDto(
            document: $this->validated('document'),
            name: $this->validated('name'),
            email: $this->validated('email'),
            cellphone: $this->validated('cellphone')
        );
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'document.unique' => 'Este documento ya está registrado.',
        ];
    }
}
