<?php

namespace App\Enums;

enum OrganizationAssignmentStatus: string
{
    case Planned = 'planned';
    case Active = 'active';
    case Completed = 'completed';
    case Archived = 'archived';
}
