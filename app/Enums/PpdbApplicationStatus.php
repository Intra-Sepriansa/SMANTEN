<?php

namespace App\Enums;

enum PpdbApplicationStatus: string
{
    case Draft = 'draft';
    case Submitted = 'submitted';
    case UnderReview = 'under_review';
    case Verified = 'verified';
    case Eligible = 'eligible';
    case Accepted = 'accepted';
    case Waitlisted = 'waitlisted';
    case Rejected = 'rejected';
    case Withdrawn = 'withdrawn';
}
