<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Exceptions\DuplicateResourceException;
use App\Types\Users\User;
use App\Types\Users\CreateUserDto;
use App\Types\Users\VerifyUserDto;
use App\Types\Users\UserRepository as UserRepositoryInterface;
use App\Models\User as UserModel;
use Illuminate\Database\QueryException;

/**
 * Implementation of UserRepository interface
 *
 * This class implements the auto-generated UserRepository interface
 * providing concrete functionality for user operations.
 */
class UserRepository implements UserRepositoryInterface
{
    /**
     * Create a new user
     *
     * @param CreateUserDto $user
     * @return User
     */
    public function create(CreateUserDto $user): User
    {
        try {
            // Create user in database
            // Laravel automatically adds created_at and updated_at timestamps
            $userModel = UserModel::create([
                'document' => $user->document,
                'name' => $user->name,
                'email' => $user->email,
                'cellphone' => $user->cellphone,
            ]);

            // Convert Eloquent model to User type
            return $this->modelToType($userModel);
        } catch (QueryException $e) {
            // Check if it's a duplicate entry error (error code 23000)
            if ($e->getCode() === '23000') {
                // Extract the field name from the error message
                $field = $this->extractDuplicateField($e->getMessage());

                throw new DuplicateResourceException(
                    field: $field,
                    value: $user->$field ?? 'unknown'
                );
            }

            // Re-throw if it's a different error
            throw $e;
        }
    }

    /**
     * Verify user credentials
     *
     * @param VerifyUserDto $user
     * @return User|null
     */
    public function verify(VerifyUserDto $user): ?User
    {
        // Find user by document and cellphone
        $userModel = UserModel::where('document', $user->document)
            ->where('cellphone', $user->cellphone)
            ->first();

        if (!$userModel) {
            return null;
        }

        // Convert Eloquent model to User type
        return $this->modelToType($userModel);
    }

    /**
     * Convert Eloquent model to User type
     *
     * Helper method to avoid code duplication
     */
    private function modelToType(UserModel $model): User
    {
        return new User(
            id: (string) $model->id,
            document: $model->document,
            name: $model->name,
            email: $model->email,
            cellphone: $model->cellphone,
            createdAt: $model->created_at->toIso8601String(),
            updatedAt: $model->updated_at->toIso8601String(),
        );
    }

    /**
     * Extract the field name from a duplicate entry error message
     */
    private function extractDuplicateField(string $errorMessage): string
    {
        // Extract field from: "Duplicate entry '...' for key 'users.users_document_unique'"
        if (preg_match("/for key '[\w.]*_(\w+)_unique'/", $errorMessage, $matches)) {
            return $matches[1];
        }

        // Fallback: try to extract from the column name in the error
        if (preg_match("/Duplicate entry '[^']+' for key '[\w.]*\.(\w+)'/", $errorMessage, $matches)) {
            return $matches[1];
        }

        return 'value';
    }
}
