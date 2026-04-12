<?php

namespace App\Enums;

enum PpdbDocumentStatus: string
{
    case Pending = 'pending';
    case Verified = 'verified';
    case Rejected = 'rejected';
}
