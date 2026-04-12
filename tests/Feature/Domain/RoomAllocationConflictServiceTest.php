<?php

use App\Models\AcademicTerm;
use App\Models\AcademicYear;
use App\Models\Employee;
use App\Models\GradeLevel;
use App\Models\Room;
use App\Models\Subject;
use App\Models\TeachingGroup;
use App\Models\TimetableEntry;
use App\Models\TimetablePeriod;
use App\Models\TimetableVersion;
use App\Services\RoomAllocationConflictService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;

uses(RefreshDatabase::class);

it('rejects timetable conflicts for the same room and period', function () {
    $academicYear = AcademicYear::create([
        'name' => '2026/2027',
        'starts_on' => '2026-07-13',
        'ends_on' => '2027-06-25',
        'is_active' => true,
    ]);

    $term = AcademicTerm::create([
        'academic_year_id' => $academicYear->id,
        'name' => 'Semester Ganjil',
        'term_type' => 'odd',
        'starts_on' => '2026-07-13',
        'ends_on' => '2026-12-18',
        'is_active' => true,
    ]);

    $grade = GradeLevel::create([
        'grade_number' => 10,
        'label' => 'Kelas X',
        'is_active' => true,
    ]);

    $teacher = Employee::create([
        'full_name' => 'Guru A',
        'employee_type' => 'teacher',
        'is_active' => true,
    ]);

    $otherTeacher = Employee::create([
        'full_name' => 'Guru B',
        'employee_type' => 'teacher',
        'is_active' => true,
    ]);

    $subject = Subject::create([
        'code' => 'MTK',
        'name' => 'Matematika',
        'is_active' => true,
    ]);

    $room = Room::create([
        'code' => 'KLS-01',
        'name' => 'Ruang Kelas 01',
        'room_type' => 'classroom',
        'is_schedulable' => true,
        'supports_moving_class' => true,
        'is_active' => true,
    ]);

    $groupA = TeachingGroup::create([
        'academic_year_id' => $academicYear->id,
        'grade_level_id' => $grade->id,
        'homeroom_employee_id' => $teacher->id,
        'code' => 'X-1',
        'name' => 'Kelas X-1',
        'capacity' => 36,
        'is_active' => true,
    ]);

    $groupB = TeachingGroup::create([
        'academic_year_id' => $academicYear->id,
        'grade_level_id' => $grade->id,
        'homeroom_employee_id' => $otherTeacher->id,
        'code' => 'X-2',
        'name' => 'Kelas X-2',
        'capacity' => 36,
        'is_active' => true,
    ]);

    $period = TimetablePeriod::create([
        'academic_year_id' => $academicYear->id,
        'name' => 'Jam Ke-1',
        'day_of_week' => 1,
        'sequence' => 1,
        'starts_at' => '08:00:00',
        'ends_at' => '08:45:00',
        'is_break' => false,
    ]);

    $version = TimetableVersion::create([
        'academic_term_id' => $term->id,
        'name' => 'Draft 1',
        'status' => 'draft',
    ]);

    TimetableEntry::create([
        'timetable_version_id' => $version->id,
        'teaching_group_id' => $groupA->id,
        'timetable_period_id' => $period->id,
        'room_id' => $room->id,
        'subject_id' => $subject->id,
        'employee_id' => $teacher->id,
        'status' => 'scheduled',
    ]);

    $service = app(RoomAllocationConflictService::class);

    expect(fn () => $service->assertNoConflict($version, $period, $groupB, $room, $otherTeacher))
        ->toThrow(ValidationException::class);
});
