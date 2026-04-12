<?php

use App\Models\User;

it('returns the authenticated user for sanctum token requests', function () {
    $user = User::factory()->create();
    $token = $user->createToken('phase-3-web')->plainTextToken;

    $response = $this
        ->withHeader('Authorization', 'Bearer '.$token)
        ->getJson('/api/auth/user');

    $response
        ->assertOk()
        ->assertJsonPath('data.id', $user->id)
        ->assertJsonPath('data.email', $user->email);
});
