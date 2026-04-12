<?php

namespace Database\Seeders;

use App\Enums\AcademicTermType;
use App\Models\AcademicTerm;
use App\Models\AcademicYear;
use App\Models\GradeLevel;
use App\Models\Subject;
use Illuminate\Database\Seeder;

class AcademicFoundationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $academicYear = AcademicYear::query()->updateOrCreate(
            ['name' => '2026/2027'],
            [
                'starts_on' => '2026-07-13',
                'ends_on' => '2027-06-25',
                'is_active' => true,
            ],
        );

        AcademicTerm::query()->updateOrCreate(
            ['academic_year_id' => $academicYear->id, 'term_type' => AcademicTermType::Odd->value],
            [
                'name' => 'Semester Ganjil 2026/2027',
                'starts_on' => '2026-07-13',
                'ends_on' => '2026-12-18',
                'is_active' => true,
            ],
        );

        AcademicTerm::query()->updateOrCreate(
            ['academic_year_id' => $academicYear->id, 'term_type' => AcademicTermType::Even->value],
            [
                'name' => 'Semester Genap 2026/2027',
                'starts_on' => '2027-01-04',
                'ends_on' => '2027-06-25',
                'is_active' => false,
            ],
        );

        foreach ([10 => 'Kelas X', 11 => 'Kelas XI', 12 => 'Kelas XII'] as $grade => $label) {
            GradeLevel::query()->updateOrCreate(
                ['grade_number' => $grade],
                ['label' => $label, 'is_active' => true],
            );
        }

        $subjects = [
            ['code' => 'PAI', 'name' => 'Pendidikan Agama'],
            ['code' => 'PPKN', 'name' => 'Pendidikan Pancasila'],
            ['code' => 'BIN', 'name' => 'Bahasa Indonesia'],
            ['code' => 'ENG', 'name' => 'Bahasa Inggris'],
            ['code' => 'MTK', 'name' => 'Matematika'],
            ['code' => 'BIO', 'name' => 'Biologi'],
            ['code' => 'KIM', 'name' => 'Kimia'],
            ['code' => 'FIS', 'name' => 'Fisika'],
            ['code' => 'SEJ', 'name' => 'Sejarah'],
            ['code' => 'INF', 'name' => 'Informatika'],
        ];

        foreach ($subjects as $subject) {
            Subject::query()->updateOrCreate(
                ['code' => $subject['code']],
                [
                    ...$subject,
                    'curriculum_category' => 'core',
                    'weekly_periods' => 4,
                    'is_active' => true,
                ],
            );
        }
    }
}
