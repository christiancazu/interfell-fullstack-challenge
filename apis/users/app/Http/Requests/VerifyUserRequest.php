<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Types\Users\VerifyUserDto;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request for verifying user credentials
 *
 * Handles HTTP validation and converts to auto-generated DTO
 */
class VerifyUserRequest extends FormRequest
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
        $config = app('shared.fields');

        return [
            'document' => [
                'required',
                'string',
                "max:{$config['DOCUMENT_MAX_LENGTH']}"
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
    public function toDto(): VerifyUserDto
    {
        return new VerifyUserDto(
            document: $this->validated('document'),
            cellphone: $this->validated('cellphone')
        );
    }
}
