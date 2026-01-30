<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\VerifyUserRequest;
use App\Services\UserService;
use App\Types\Users\User;
use Illuminate\Http\JsonResponse;

/**
 * User controller demonstrating the architecture flow:
 *
 * Request → Controller → Service → Repository → Database
 *
 * - Controller: Handles HTTP (validation, request/response)
 * - Service: Business logic
 * - Repository: Data access (implements auto-generated UserRepository interface)
 *
 * All layers use auto-generated types from TypeScript definitions:
 * - CreateUserDto (DTO from TypeScript)
 * - VerifyUserDto (DTO from TypeScript)
 * - User (Entity from TypeScript)
 * - UserRepository (Interface from TypeScript)
 */
class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    /**
     * Create a new user
     *
     * @return JsonResponse<User>
     */
    public function create(CreateUserRequest $request): JsonResponse
    {
        $dto = $request->toDto();
        $user = $this->userService->createUser($dto);

        return response()->json($user, 201);
    }

    /**
     * Verify user credentials
     *
     * @return JsonResponse<User|array{message: string}>
     */
    public function verify(VerifyUserRequest $request): JsonResponse
    {
        $dto = $request->toDto();
        $user = $this->userService->verifyUser($dto);

        if (!$user) {
            return response()->json([
                'message' => 'El usuario no fue encontrado o las credenciales son incorrectas.',
            ], 404);
        }

        return response()->json($user);
    }
}
