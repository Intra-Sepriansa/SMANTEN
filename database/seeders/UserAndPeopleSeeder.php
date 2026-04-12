<?php

namespace Database\Seeders;

use App\Enums\EmployeeType;
use App\Enums\RoleName;
use App\Enums\UserStatus;
use App\Models\AlumniProfile;
use App\Models\Employee;
use App\Models\Guardian;
use App\Models\Role;
use App\Models\StudentProfile;
use App\Models\TracerStudyResponse;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserAndPeopleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roleMap = Role::query()->pluck('id', 'slug');

        $superAdmin = User::factory()->create([
            'name' => 'Super Admin SMANTEN',
            'username' => 'superadmin',
            'email' => 'superadmin@smantenjo.sch.id',
            'status' => UserStatus::Active,
        ]);
        $superAdmin->roles()->sync([$roleMap[RoleName::SuperAdmin->value] => ['assigned_at' => now()]]);

        $operator = User::factory()->create([
            'name' => 'Ahmadi Busro',
            'username' => 'operator.smanten',
            'email' => 'operator@smantenjo.sch.id',
            'status' => UserStatus::Active,
        ]);
        $operator->roles()->sync([$roleMap[RoleName::OperatorSekolah->value] => ['assigned_at' => now()]]);

        $guru = User::factory()->create([
            'name' => 'Silvia Kholifatu Syifa',
            'username' => 'guru.kurikulum',
            'email' => 'guru.kurikulum@smantenjo.sch.id',
            'status' => UserStatus::Active,
        ]);
        $guru->roles()->sync([$roleMap[RoleName::Guru->value] => ['assigned_at' => now()]]);

        $jurnalis = User::factory()->create([
            'name' => 'Jurnalis SMANTEN',
            'username' => 'jurnalis.smanten',
            'email' => 'jurnalistik@smantenjo.sch.id',
            'status' => UserStatus::Active,
        ]);
        $jurnalis->roles()->sync([$roleMap[RoleName::JurnalisSiswa->value] => ['assigned_at' => now()]]);

        $siswaUser = User::factory()->create([
            'name' => 'Dedi Tri Setiawan',
            'username' => 'dedi.tri',
            'email' => 'dedi.tri@student.smantenjo.sch.id',
            'status' => UserStatus::Active,
        ]);
        $siswaUser->roles()->sync([$roleMap[RoleName::Siswa->value] => ['assigned_at' => now()]]);

        $waliUser = User::factory()->create([
            'name' => 'Wali Murid Contoh',
            'username' => 'wali.murid',
            'email' => 'wali@example.com',
            'status' => UserStatus::Active,
        ]);
        $waliUser->roles()->sync([$roleMap[RoleName::WaliMurid->value] => ['assigned_at' => now()]]);

        $alumniUser = User::factory()->create([
            'name' => 'Alumni SMANTEN',
            'username' => 'alumni.smanten',
            'email' => 'alumni@smantenjo.sch.id',
            'status' => UserStatus::Active,
        ]);
        $alumniUser->roles()->sync([$roleMap[RoleName::Alumni->value] => ['assigned_at' => now()]]);

        Employee::query()->updateOrCreate(
            ['user_id' => $operator->id],
            [
                'employee_number' => 'EMP-OP-001',
                'full_name' => 'Ahmadi Busro',
                'employee_type' => EmployeeType::Operator,
                'email' => $operator->email,
                'phone' => $operator->phone,
                'is_active' => true,
                'joined_at' => now()->subYears(5)->toDateString(),
            ],
        );

        Employee::query()->updateOrCreate(
            ['user_id' => $guru->id],
            [
                'employee_number' => 'EMP-GR-001',
                'full_name' => 'Silvia Kholifatu Syifa',
                'employee_type' => EmployeeType::Teacher,
                'email' => $guru->email,
                'phone' => $guru->phone,
                'is_active' => true,
                'joined_at' => now()->subYears(4)->toDateString(),
            ],
        );

        $student = StudentProfile::query()->updateOrCreate(
            ['user_id' => $siswaUser->id],
            [
                'nis' => 'SMT-2026-001',
                'nisn' => '0012026201',
                'full_name' => 'Dedi Tri Setiawan',
                'gender' => 'male',
                'address' => 'Babakan, Tenjo, Bogor',
                'district' => 'Tenjo',
                'city' => 'Kabupaten Bogor',
                'province' => 'Jawa Barat',
                'latitude' => -6.355,
                'longitude' => 106.4701,
                'enrollment_status' => 'active',
                'admitted_at' => now()->subYears(1)->toDateString(),
            ],
        );

        $guardian = Guardian::query()->updateOrCreate(
            ['user_id' => $waliUser->id],
            [
                'full_name' => 'Wali Murid Contoh',
                'relation_type' => 'parent',
                'phone' => $waliUser->phone,
                'email' => $waliUser->email,
                'is_active' => true,
            ],
        );

        $student->guardians()->syncWithoutDetaching([
            $guardian->id => [
                'relationship_type' => 'parent',
                'is_primary_contact' => true,
                'is_financial_guardian' => true,
            ],
        ]);

        $alumni = AlumniProfile::query()->updateOrCreate(
            ['user_id' => $alumniUser->id],
            [
                'student_profile_id' => null,
                'graduation_year' => 2024,
                'full_name' => 'Alumni SMANTEN',
                'institution_name' => 'Universitas Esa Unggul',
                'occupation_title' => 'Mahasiswa',
                'career_cluster' => 'Pendidikan',
                'city' => 'Jakarta',
                'province' => 'DKI Jakarta',
                'contact_email' => $alumniUser->email,
                'is_public_profile' => true,
            ],
        );

        TracerStudyResponse::query()->updateOrCreate(
            ['alumni_profile_id' => $alumni->id],
            [
                'status' => 'submitted',
                'current_activity' => 'college',
                'institution_name' => 'Universitas Esa Unggul',
                'major' => 'Jurnalistik',
                'location_city' => 'Jakarta',
                'location_province' => 'DKI Jakarta',
                'is_publicly_displayable' => true,
                'submitted_at' => now(),
            ],
        );
    }
}
