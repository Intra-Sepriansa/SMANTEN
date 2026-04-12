<?php

namespace App\Enums;

enum TracerStudyStatus: string
{
    case Draft = 'draft';
    case Submitted = 'submitted';
    case Verified = 'verified';
}
