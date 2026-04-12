<?php

namespace App\Enums;

enum RoomType: string
{
    case Classroom = 'classroom';
    case Laboratory = 'laboratory';
    case Library = 'library';
    case Leadership = 'leadership';
    case TeachersLounge = 'teachers_lounge';
    case Osis = 'osis';
    case Health = 'health';
    case Counseling = 'counseling';
    case Worship = 'worship';
    case Sanitation = 'sanitation';
    case Administration = 'administration';
    case Support = 'support';
}
