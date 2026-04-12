<?php

namespace App\Http\Controllers\Api\Internal\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;

class RoomController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Room::class);

        return RoomResource::collection(Room::query()->orderBy('code')->paginate());
    }

    public function store(StoreRoomRequest $request): RoomResource
    {
        $this->authorize('create', Room::class);

        $room = Room::create($request->validated());

        return new RoomResource($room);
    }

    public function update(StoreRoomRequest $request, Room $room): RoomResource
    {
        $this->authorize('update', $room);

        $room->update($request->validated());

        return new RoomResource($room);
    }
}
