<?php

namespace App\Enums;

enum EmployeeType: string
{
    case Teacher = 'teacher';
    case Administration = 'administration';
    case Operator = 'operator';
    case Leadership = 'leadership';
    case Support = 'support';
}
