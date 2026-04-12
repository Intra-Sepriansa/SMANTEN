<?php

namespace App\Enums;

enum RoleName: string
{
    case SuperAdmin = 'super_admin';
    case OperatorSekolah = 'operator_sekolah';
    case Guru = 'guru';
    case StaffTu = 'staff_tu';
    case Siswa = 'siswa';
    case WaliMurid = 'wali_murid';
    case JurnalisSiswa = 'jurnalis_siswa';
    case Alumni = 'alumni';
}
