<?php

namespace App\Enums;

enum PortfolioVisibility: string
{
    case Private = 'private';
    case Internal = 'internal';
    case Public = 'public';
}
