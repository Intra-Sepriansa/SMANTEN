<?php

namespace Database\Seeders;

use App\Models\SchoolProfile;
use Illuminate\Database\Seeder;

class SchoolProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $school = SchoolProfile::query()->updateOrCreate(
            ['npsn' => '20231338'],
            [
                'name' => 'SMAN 1 Tenjo',
                'official_name' => 'SMAN 1 TENJO',
                'accreditation' => 'A',
                'establishment_decree_number' => '421/348/KPTS/HUK/2005',
                'established_at' => '2005-11-28',
                'curriculum_name' => 'Kurikulum Merdeka',
                'study_schedule_type' => 'Sehari Penuh (5 Hari Kerja)',
                'bank_name' => 'Bank BJB',
                'bank_branch' => 'KCP/Unit Leuwiliang',
                'bank_account_name' => 'SMAN 1 TENJO',
                'email' => 'smantenjo@yahoo.com',
                'phone' => '02159761066',
                'website_url' => 'http://www.smantenjo.sch.id',
                'street_address' => 'JL. Raya Tenjo - Parung Panjang KM. 03',
                'rt' => '3',
                'rw' => '1',
                'hamlet' => 'Babakan',
                'village' => 'Babakan',
                'district' => 'Tenjo',
                'city' => 'Kabupaten Bogor',
                'province' => 'Jawa Barat',
                'postal_code' => '16370',
                'latitude' => -6.3483,
                'longitude' => 106.4638,
                'land_area_square_meters' => 11396,
                'principal_name' => 'Titin Sriwartini',
                'operator_name' => 'Ahmadi Busro',
                'timezone' => 'Asia/Jakarta',
                'metadata' => [
                    'student_count' => 1073,
                    'teaching_group_count' => 30,
                    'physical_classroom_count' => 21,
                    'laboratory_count' => 3,
                    'library_count' => 2,
                ],
            ],
        );

        $school->valueStatements()->updateOrCreate(
            ['key' => 'batara_kresna'],
            [
                'label' => 'BATARA KRESNA',
                'value_text' => 'Beriman, Bertaqwa, Berkarakter, dan Bebas Narkoba',
                'description' => 'Pedoman moral autentik SMAN 1 Tenjo.',
                'sort_order' => 1,
                'is_active' => true,
            ],
        );
    }
}
