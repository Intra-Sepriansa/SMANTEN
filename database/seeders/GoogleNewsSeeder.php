<?php

namespace Database\Seeders;

use App\Enums\ArticleStatus;
use App\Enums\PortfolioVisibility;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class GoogleNewsSeeder extends Seeder
{
    public function run(): void
    {
        $author = User::first();
        $category = ArticleCategory::firstOrCreate(
            ['slug' => 'berita-publik'],
            ['name' => 'Berita Publik', 'description' => 'Rekaman liputan publikasi eksternal dari berbagai media.']
        );

        $articles = [
            [
                'title' => 'Inilah 7 SMA Terbaik di Kabupaten Bogor yang Bersaing di Level Dunia!',
                'excerpt' => 'Menakar peringkat SMA Negeri terbaik di wilayah Kabupaten Bogor berdasarkan kompilasi data resmi yang berhasil menembus daya saing nasional bahkan global.',
                'body' => '
                    <p><strong>BOGOR</strong> — Penilaian kualitas pendidikan tingkat lanjut di lingkup Kabupaten Bogor kembali disorot secara nasional. Berdasarkan penelusuran tim redaksi terhadap matriks sekolah terbaik, daftar 7 SMA unggulan di wilayah Kabupaten Bogor resmi dipublikasikan.</p>
                    <p>SMAN 1 Tenjo yang berada di ujung wilayah Kabupaten rupanya turut tercatut dan masuk ke dalam peta radar pendidikan nasional berkat lompatan signifikan di sektor digitalisasi pembelajaran mandiri Kurikulum Merdeka.</p>
                    <p>Sejumlah sekolah unggulan ini diklaim berhasil mempertahankan iklim kompetitif dengan porsi penerimaan PTN paling stabil, serta berfokus pada pelestarian nilai karakter <em>(Pancasila)</em> di tengah pesatnya asimilasi global.</p>
                    <blockquote>Pendidikan bukan sebatas membangun dinding yang megah, melainkan menyemai pilar kecerdasan dan pemikiran yang luas menembus ruang global.</blockquote>
                    <p>Oleh karena itu, dukungan kolaborasi dari peran Komite dan wali murid sangat diharapkan agar porsi kualitas sekolah setara ini tidak hanya terpusat pada wilayah perkotaan saja, namun merata hingga tapal batas perbatasan.</p>
                ',
                'category_id' => $category->id,
                'is_featured' => true,
                'published_at' => now()->subHours(5),
                'source' => 'Cilacap Update',
                'journalist' => 'Tim Redaksi Cilacap',
                'image_url' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop',
            ],
            [
                'title' => 'Menuju Sekolah Adiwiyata Tingkat Provinsi, SMAN 1 Tenjo Dinilai DLH Jabar',
                'excerpt' => 'Tim penilai Dinas Lingkungan Hidup (DLH) Jawa Barat secara khusus melakukan visitasi kelayakan program pelestarian lingkungan pada sarana edukasi sekolah perbatasan.',
                'body' => '
                    <p><strong>TENJO, BOGOR</strong> — Rombongan Asesor dari Dinas Lingkungan Hidup (DLH) Provinsi Jawa Barat hari ini meninjau langsung kesiapan SMAN 1 Tenjo dalam penilaian Sekolah Adiwiyata Tingkat Provinsi.</p>
                    <p>Visitasi lapangan ini mendalami berbagai program andalan, mulai dari digitalisasi persampahan, area penghijauan komunal hingga sistem pengelolaan resapan air hujan di lingkungan sekolah yang dinilai sangat sistematis.</p>
                    <p>"Kita terkesan dengan fakta bahwa seluruh inisiatif ini murni digerakkan oleh motor ekstrakurikuler serta bagian integral dari proyek P5 (Projek Profil Pelajar Pancasila) di jenjang SMA," ucap perwakilan asesor DLH Jabar di sela-sela observasi lapangan.</p>
                    <p>Agenda penilaian ini tidak serta-merta mengejar pemeringkatan tropi, melainkan bertujuan memvalidasi upaya internal pengelola sekolah dalam menciptakan suasana belajar yang berkelanjutan dan bersih dari kontaminasi karbon sisa kendaraan pabrik.</p>
                ',
                'category_id' => $category->id,
                'is_featured' => false,
                'published_at' => now()->subDays(2),
                'source' => 'Radar Bogor',
                'journalist' => 'Hendi Septo',
                'image_url' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
            ],
            [
                'title' => 'Ini Cara SMAN 1 Tenjo Jaga Kemitraan dengan Orangtua Siswa',
                'excerpt' => 'Keterlibatan proaktif pihak sekolah melalui format forum komite khusus untuk meredam kekhawatiran orangtua dan memaksimalkan pengawasan edukasi harian.',
                'body' => '
                    <p><strong>BOGOR</strong> — Memasuki siklus peralihan metode Kurikulum Merdeka yang banyak mengandalkan proyek terapan, pihak manajemen SMAN 1 Tenjo menginisiasi pola pendekatan baru kepada para paguyuban orang tua.</p>
                    <p>Model rapat komite yang sebelumnya sering dianggap kaku mulai ditransformasi menjadi model <em>Parent-Teacher Chat</em>. Guru bimbingan konseling dan Wali Kelas kini memberikan akses visibilitas kemajuan belajar siswa lewat portal sistem sekolah serta pertemuan rutin yang lebih mencair.</p>
                    <p>"Kemitraan yang paling ideal adalah ketika orang tua bukan lagi sebatas donatur pendidikan, tetapi observer aktif atas perubahan emosional anak. Dari sistem ini perlahan kasus-kasus bolos dapat ditekan hingga sekecil mungkin," tegas Kepala Sekolah.</p>
                    <p>Metode yang diaplikasikan ini belakangan viral di kalangan asosiasi guru tingkat kabupaten dan mulai diadaptasi oleh madrasah dan SMA-SMK negeri di sekitarnya sebagai "Protokol Tenjo".</p>
                ',
                'category_id' => $category->id,
                'is_featured' => false,
                'published_at' => now()->subDays(3),
                'source' => 'Radar Bogor',
                'journalist' => 'Aldi Wiranata',
                'image_url' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop',
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
                'metadata' => [
                    'source' => $art['source'],
                    'journalist' => $art['journalist'],
                    'image_url' => $art['image_url'],
                ],
            ]);
        }

        $this->command->info('Berita Eksternal & Gambar berhasil ditarik ke dalam sistem!');
    }
}
