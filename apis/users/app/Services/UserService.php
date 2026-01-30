<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\UserRepository;
use App\Types\Users\User;
use App\Types\Users\CreateUserDto;
use App\Types\Users\VerifyUserDto;

/**
 * User service that uses the UserRepository to perform operations
 *
 * This service applies the Repository Pattern:
 * Controller -> Service -> Repository -> Database
 */
class UserService
{
    public function __construct(
        private readonly UserRepository $userRepository
    ) {}

    /**
     * Create a new user
     *
     * The service can add business logic here before/after calling the repository
     */
    public function createUser(CreateUserDto $dto): User
    {
        // You can add business logic here, for example:
        // - Validate business rules
        // - Send notifications
        // - Log events

        // Call the repository to persist the data
        return $this->userRepository->create($dto);
    }

    /**
     * Verify user credentials
     */
    public function verifyUser(VerifyUserDto $dto): ?User
    {
        // Call the repository to verify the user
        return $this->userRepository->verify($dto);
    }
}
