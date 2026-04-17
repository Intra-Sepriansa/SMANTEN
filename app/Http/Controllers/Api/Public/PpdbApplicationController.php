<?php

namespace App\Http\Controllers\Api\Public;

use App\Enums\PpdbApplicationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SubmitPpdbApplicationRequest;
use App\Http\Resources\PpdbApplicationResource;
use App\Models\PpdbApplication;
use Illuminate\Support\Str;

class PpdbApplicationController extends Controller
{
    public function store(SubmitPpdbApplicationRequest $request): PpdbApplicationResource
    {
        $application = PpdbApplication::create([
            ...$request->validated(),
            'user_id' => $request->user()?->getKey(),
            'registration_number' => 'PPDB-'.now()->format('YmdHis').'-'.Str::upper(Str::random(5)),
            'status' => PpdbApplicationStatus::Submitted,
            'submitted_at' => now(),
        ]);

        return new PpdbApplicationResource($application->load('cycle'));
    }
}
