<?php

namespace Database\Seeders;

use App\Enums\ArticleStatus;
use App\Enums\PortfolioVisibility;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BeritaPositifSeeder extends Seeder
{
    public function run(): void
    {
        $author = User::first();
        $category = ArticleCategory::firstOrCreate(
            ['slug' => 'prestasi'],
            ['name' => 'Prestasi & Penghargaan', 'description' => 'Berita seputar capaian siswa dan sekolah.']
        );
        $kegiatanCategory = ArticleCategory::firstOrCreate(
            ['slug' => 'kegiatan-sekolah'],
            ['name' => 'Kegiatan Sekolah', 'description' => 'Berita dan liputan kegiatan di dalam lingkungan SMAN 1 Tenjo.']
        );

        $articles = [
            [
                'title' => 'SMAN 1 Tenjo Raih Juara Umum Kompetisi Inovasi Pendidikan Tingkat Provinsi 2025',
                'excerpt' => 'Sebuah capaian membanggakan ditorehkan oleh siswa-siswi SMAN 1 Tenjo dengan meraih gelar juara umum dalam ajang Kompetisi Inovasi Pendidikan (KIP) Tingkat Provinsi Jawa Barat.',
                'body' => '
                    <p><strong>BANDUNG</strong> — Prestasi gemilang kembali dicetak oleh insan pendidikan SMAN 1 Tenjo. Pada perhelatan Kompetisi Inovasi Pendidikan (KIP) Tingkat Provinsi Jawa Barat yang diselenggarakan awal tahun ini, kontingen SMAN 1 Tenjo berhasil membawa pulang trofi Juara Umum sekaligus menyabet menyisihkan ratusan peserta dari berbagai kota dan kabupaten.</p>
                    <p>Keberhasilan ini didorong oleh <strong>inovasi digitalisasi sampah terpadu</strong> yang digagas oleh para siswa yang tergabung dalam Ekstrakurikuler KIR dan Adiwiyata. Aplikasi berbasis Internet of Things (IoT) yang dinamakan <em>"Tenjo Green Hub"</em> dinilai oleh dewan juri sebagai langkah paling mutakhir dan adaptif yang diimplementasikan di tingkat sekolah menengah.</p>
                    <p>Kepala SMAN 1 Tenjo menyampaikan apresiasi setinggi-tingginya kepada seluruh pembina dan murid yang telibat. "Ini membuktikan bahwa keterbatasan jarak atau lokasi tidak menjadi halangan bagi siswa kita untuk berpikir global dan menyelesaikan masalah nyata di masyarakat," ungkap beliau.</p>
                    <blockquote>Pendidikan yang bermakna bukan hanya sekadar teori di atas kertas, tetapi dampak yang bisa diciptakan di sekitarnya.</blockquote>
                    <p>Semoga prestasi ini dapat memicu lahirnya karya-karya dan penemuan cemerlang lainnya di masa depan. Selamat, SMAN 1 Tenjo!</p>
                ',
                'category_id' => $category->id,
                'is_featured' => true,
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Program P5 SMAN 1 Tenjo Sukses Gelar Panen Karya "Gelar Budaya Nusantara"',
                'excerpt' => 'Ratusan karya seni, produk kewirausahaan, hingga pertunjukan teatrikal mewarnai puncak acara Gelar Panen Karya Projek Penguatan Profil Pelajar Pancasila (P5).',
                'body' => '
                    <p><strong>TENJO</strong> — Suasana meriah menyelimuti lapangan pusat SMAN 1 Tenjo sejak pagi hari. Berbagai stan pameran, dekorasi tematik, dan panggung pertunjukan berdiri kokoh menyambut dimulainya prosesi <strong>Gelar Panen Karya P5</strong> semester ganjil.</p>
                    <p>Dengan mengusung tema <em>"Kearifan Lokal dan Budaya Nusantara"</em>, lebih dari 15 angkatan kelas menampilkan karya terbaiknya. Mulai dari gastronomi tradisional program *Mustikarasa*, pertunjukan Tari Tradisional, hingga instalasi seni dari limbah daur ulang yang dikuratori langsung secara profesional oleh para pengajar.</p>
                    <p>Banyak warga lingkungan sekitar dan wali murid yang turut hadir mengapresiasi karya-karya orisinil anak bangsa ini. "Ini adalah bentuk ruang kebebasan berekspresi sekaligus ujian kompetensi secara nyata tanpa harus melihat soal pilihan ganda," puji Bapak Suwandi, salah seorang penilai independen yang diundang khusus dari dinas pendidikan.</p>
                    <p>Diharapkan agenda seperti ini tidak hanya berhenti sebagai ajang seremonial, tetapi dapat melahirkan calon wirausaha muda dan pelestari budaya di masa yang akan datang.</p>
                ',
                'category_id' => $kegiatanCategory->id,
                'is_featured' => false,
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Gubernur Resmikan Pembangunan Fasilitas Kelas Baru dan Renovasi Digital SMAN 1 Tenjo',
                'excerpt' => 'Pemerintah Provinsi menegaskan komitmen pemerataan pendidikan berkualitas dengan meluncurkan dana perbaikan infrastruktur vital untuk menunjang Moving Class di SMAN 1 Tenjo.',
                'body' => '
                    <p><strong>BOGOR</strong> — Merespons cepat kebutuhan infrastruktur pendidikan di perbatasan kabupaten, Gubernur meresmikan peletakan batu pertama perluasan dan rehabilitasi ruang kelas di SMAN 1 Tenjo hari ini.</p>
                    <p>Dalam sambutannya, beliau menekankan bahwa fasilitas yang memadai merupakan prasyarat utama untuk menghasilkan Sumber Daya Manusia yang cerdas. Sejalan dengan program <em>Moving Class</em> yang diadaptasi sekolah ini, penambahan ruangan, integrasi jaringan internet *Smart Board* hingga revitalisasi laboratorium sains menjadi prioritas dalam proyek pembenahan ini.</p>
                    <p>"SMAN 1 Tenjo sudah membuktikan prestasi akademiknya yang luar biasa. Sudah sepantasnya kami membalas dedikasi para guru dan antusiasme para siswa dengan menghadirkan fasilitas kelas 1," tegas beliau dalam sambutannya di lapangan SMAN 1 Tenjo.</p>
                    <p>Para pimpinan sekolah dan komite optimis, pembenahan ini akan terealisasi sepenuhnya sebelum siklus PPDB baru berjalan.</p>
                ',
                'category_id' => $category->id,
                'is_featured' => false,
                'published_at' => now()->subDays(10),
            ],
            [
                'title' => 'Tim Futsal Putra SMAN 1 Tenjo Berhasil Pertahankan Gelar Juara Bertahan Bupati Cup',
                'excerpt' => 'Ketegangan mewarnai pertandingan final di mana SMAN 1 Tenjo berhasil mencetak gol kemenangan di menit-menit akhir pertandingan.',
                'body' => '
                    <p>Sorak sorai ribuan suporter pecah saat pluit panjang dibunyikan di GOR Laga Tangkas. Tim Futsal Putra SMAN 1 Tenjo kembali membuktikan kedigdayaan mereka dengan memertahankan gelar juara bertahan Bupati Cup 2025.</p>
                    <p>Bermain sangat disiplin di bawah tekanan, taktik pertahanan rapi dan serangan balik cepat membuahkan hasil memuaskan. Gol tunggal yang dicetak oleh kapten tim berbuah kemenangan 1-0 atas tim lawan di laga final yang berlangsung sengit.</p>
                    <p>Semoga semangat juang dari lapangan pertandingan ini bisa menular ke semangat akademik di bangku sekolah demi mencetak generasi pemenang di masa depan!</p>
                ',
                'category_id' => $kegiatanCategory->id,
                'is_featured' => false,
                'published_at' => now()->subDays(15),
            ],
            [
                'title' => 'Lulusan SMAN 1 Tenjo Angkatan 2024 Catat Rekor Baru Diterima di PTN Bergengsi',
                'excerpt' => 'Statistik penerimaan jalur SNBP dan SNBT tahun ini meningkat tajam hingga 35%, banyak yang berhasil menembus UI, ITB, dan UGM.',
                'body' => '
                    <p>Prestasi akademik kembali menjadi perbincangan utama. Hasil rekapitulasi tim Bimbingan Konseling (BK) menunjukkan peningkatan angka kelulusan siswa SMAN 1 Tenjo menuju Perguruan Tinggi Negeri (PTN) melalui rute seleksi terpadu nasional.</p>
                    <p>Peningkatan 35% dibandingkan siklus tahun sebelumnya tidak lepas dari program pendampingan intensif (Gedor PTN) yang didesain secara kolektif oleh manajemen sekolah sejak awal siswa duduk di bangku kelas XII.</p>
                    <p>Beberapa siswa tercatat berhasil diterima di jurusan bergengsi seperti Kedokteran, Teknik Informatika, dan Hubungan Internasional di berbagai universitas kenamaan tanah air.</p>
                ',
                'category_id' => $category->id,
                'is_featured' => false,
                'published_at' => now()->subDays(20),
            ],
        ];

        foreach ($articles as $art) {
            Article::create([
                'article_category_id' => $art['category_id'],
                'author_user_id' => $author->id ?? 1,
                'reviewer_user_id' => $author->id ?? 1,
                'title' => $art['title'],
                'slug' => Str::slug($art['title'].'-'.Str::random(4)),
                'excerpt' => $art['excerpt'],
                'body' => $art['body'],
                'status' => ArticleStatus::Published,
                'visibility' => PortfolioVisibility::Public,
                'is_featured' => $art['is_featured'],
                'approved_at' => $art['published_at'],
                'published_at' => $art['published_at'],
            ]);
        }

        $this->command->info('Berita positif SMAN 1 Tenjo telah berhasil disemai!');
    }
}
