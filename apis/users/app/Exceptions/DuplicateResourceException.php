<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

/**
 * Exception thrown when trying to create a resource with duplicate unique fields
 */
class DuplicateResourceException extends Exception
{
    public function __construct(
        public readonly string $field,
        public readonly mixed $value,
    ) {
        parent::__construct("The {$field} '{$value}' has already been registered.");
    }

    /**
     * Render the exception as an HTTP response
     */
    public function render()
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
            'error' => [
                'field' => $this->field,
                'value' => $this->value,
                'type' => 'duplicate_resource',
            ]
        ], 409); // 409 Conflict
    }
}
