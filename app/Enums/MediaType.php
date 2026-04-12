<?php

namespace App\Enums;

enum MediaType: string
{
    case Image = 'image';
    case Video = 'video';
    case Document = 'document';
    case Panorama = 'panorama';
    case Model3d = 'model_3d';
    case ExternalVideo = 'external_video';
}
