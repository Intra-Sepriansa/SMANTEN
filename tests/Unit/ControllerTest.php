<?php

use App\Http\Controllers\Controller;

test('the base controller exposes authorization helpers', function () {
    $controller = new class extends Controller {};

    expect(method_exists($controller, 'authorize'))->toBeTrue()
        ->and(method_exists($controller, 'authorizeForUser'))->toBeTrue();
});
