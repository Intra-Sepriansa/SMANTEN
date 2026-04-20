<?php

namespace App\Http\Controllers\Api\Internal\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Employee;
use App\Models\PpdbApplication;
use App\Models\StudentProfile;
use App\Models\TimetableEntry;
use App\Services\AdminExportService;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function ppdbApplications(AdminExportService $exportService): StreamedResponse
    {
        $rows = PpdbApplication::query()
            ->with('cycle')
            ->latest('submitted_at')
            ->latest('created_at')
            ->lazy()
            ->map(fn (PpdbApplication $application): array => [
                $application->registration_number,
                $application->full_name,
                $application->status,
                $application->track_type,
                $application->cycle?->name,
                $application->email,
                $application->phone,
                $application->previous_school_name,
                $application->district,
                $application->city,
                $application->distance_meters !== null ? round(((float) $application->distance_meters) / 1000, 2) : null,
                $application->submitted_at,
                $application->verified_at,
                $application->decided_at,
                $application->decision_notes,
            ]);

        return $exportService->downloadCsv('ppdb-applications.csv', [
            'No Registrasi',
            'Nama',
            'Status',
            'Jalur',
            'Gelombang',
            'Email',
            'Telepon',
            'Sekolah Asal',
            'Kecamatan',
            'Kota',
            'Jarak KM',
            'Dikirim',
            'Diverifikasi',
            'Diputuskan',
            'Catatan',
        ], $rows);
    }

    public function timetable(AdminExportService $exportService): StreamedResponse
    {
        $rows = TimetableEntry::query()
            ->with(['timetableVersion', 'teachingGroup', 'timetablePeriod', 'room', 'subject', 'employee'])
            ->latest('updated_at')
            ->lazy()
            ->map(fn (TimetableEntry $entry): array => [
                $entry->timetableVersion?->name,
                $this->dayName($entry->timetablePeriod?->day_of_week),
                $entry->timetablePeriod?->sequence,
                $entry->timetablePeriod?->name,
                optional($entry->timetablePeriod?->starts_at)->format('H:i'),
                optional($entry->timetablePeriod?->ends_at)->format('H:i'),
                $entry->teachingGroup?->name,
                $entry->subject?->name,
                $entry->employee?->full_name,
                $entry->room?->name,
                $entry->status,
                $entry->notes,
            ]);

        return $exportService->downloadCsv('jadwal-pelajaran.csv', [
            'Versi',
            'Hari',
            'Urutan',
            'Jam',
            'Mulai',
            'Selesai',
            'Kelas',
            'Mata Pelajaran',
            'Guru',
            'Ruang',
            'Status',
            'Catatan',
        ], $rows);
    }

    public function students(AdminExportService $exportService): StreamedResponse
    {
        $rows = StudentProfile::query()
            ->with('user')
            ->orderBy('full_name')
            ->lazy()
            ->map(fn (StudentProfile $student): array => [
                $student->nis,
                $student->nisn,
                $student->full_name,
                $student->gender,
                $student->birth_date,
                $student->user?->email,
                $student->city,
                $student->province,
                $student->enrollment_status,
                $student->admitted_at,
                $student->graduated_at,
            ]);

        return $exportService->downloadCsv('data-siswa.csv', [
            'NIS',
            'NISN',
            'Nama',
            'Gender',
            'Tanggal Lahir',
            'Email',
            'Kota',
            'Provinsi',
            'Status',
            'Tanggal Masuk',
            'Tanggal Lulus',
        ], $rows);
    }

    public function teachers(AdminExportService $exportService): StreamedResponse
    {
        $rows = Employee::query()
            ->with('user')
            ->orderBy('full_name')
            ->lazy()
            ->map(fn (Employee $employee): array => [
                $employee->employee_number,
                $employee->full_name,
                $employee->employee_type,
                $employee->email ?? $employee->user?->email,
                $employee->phone,
                $employee->gender,
                $employee->is_active,
                $employee->joined_at,
                $employee->ended_at,
            ]);

        return $exportService->downloadCsv('data-guru.csv', [
            'NIP/NUPTK',
            'Nama',
            'Tipe',
            'Email',
            'Telepon',
            'Gender',
            'Aktif',
            'Bergabung',
            'Selesai',
        ], $rows);
    }

    public function activityLogs(AdminExportService $exportService): StreamedResponse
    {
        $rows = ActivityLog::query()
            ->with('user')
            ->latest('created_at')
            ->limit(2000)
            ->lazy()
            ->map(fn (ActivityLog $log): array => [
                $log->created_at,
                $log->event,
                $log->description,
                $log->user?->name,
                $log->subject_type,
                $log->subject_id,
                $log->ip_address,
                $log->properties,
            ]);

        return $exportService->downloadCsv('activity-logs.csv', [
            'Waktu',
            'Event',
            'Deskripsi',
            'User',
            'Subject Type',
            'Subject ID',
            'IP',
            'Properties',
        ], $rows);
    }

    public function ppdbReceipt(PpdbApplication $ppdbApplication): Response
    {
        return response()->view('exports.ppdb-receipt', [
            'application' => $ppdbApplication->loadMissing('cycle'),
        ]);
    }

    private function dayName(?int $dayOfWeek): ?string
    {
        return match ($dayOfWeek) {
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu',
            7 => 'Minggu',
            default => null,
        };
    }
}
