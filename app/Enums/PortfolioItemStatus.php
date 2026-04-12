<?php

namespace App\Enums;

enum PortfolioItemStatus: string
{
    case Draft = 'draft';
    case Submitted = 'submitted';
    case Approved = 'approved';
    case Published = 'published';
    case Archived = 'archived';
}
