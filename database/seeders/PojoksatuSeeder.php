<?php

namespace Database\Seeders;

use App\Enums\ArticleStatus;
use App\Enums\PortfolioVisibility;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PojoksatuSeeder extends Seeder
{
    public function run(): void
    {
        $author = User::first();
        $category = ArticleCategory::firstOrCreate(
            ['slug' => 'berita-publik'],
            ['name' => 'Berita Publik', 'description' => 'Rekaman liputan publikasi eksternal dari berbagai media.']
        );

        $articleData = [
            'title' => 'Gubernur Jabar Langsung Respons Aduan DPRD Kabupaten Bogor Soal Kelas Rusak di SMAN 1 Tenjo',
            'excerpt' => 'Pemprov Jabar bergerak cepat menanggapi laporan dari DPRD Kabupaten Bogor terkait kondisi beberapa ruang kelas yang memprihatinkan di SMAN 1 Tenjo, memastikan revitalisasi segera dilakukan.',
            'body' => '
                <p><strong>BOGOR (Pojoksatu.id)</strong> — Isu mengenai infrastruktur sekolah menengah atas di wilayah perbatasan mendapat sorotan tajam dari Dewan Perwakilan Rakyat Daerah (DPRD) Kabupaten Bogor. Dalam Rapat Dengar Pendapat (RDP) terbaru, delegasi DPRD menyampaikan laporan mendesak mengenai kondisi fisik sejumlah ruang kelas di SMAN 1 Tenjo yang mengalami kerusakan cukup signifikan akibat dimakan usia dan faktor cuaca.</p>
                
                <h3>Respons Kilat Pemerintah Provinsi Jawa Barat</h3>
                <p>Laporan tersebut tidak butuh waktu lama untuk sampai ke telinga Gubernur Jawa Barat. Dalam keterangannya kepada publik, orang nomor satu di Jawa Barat tersebut langsung menginstruksikan Dinas Pendidikan (Disdik) Provinsi untuk turun tangan melakukan peninjauan lapangan.</p>
                <p>"Pendidikan adalah tulang punggung kemajuan daerah. Fasilitas ruang kelas yang memadai dan aman adalah hak mutlak setiap peserta didik. Tidak boleh ada siswa di Jawa Barat, termasuk di Tenjo, yang belajar dalam kondisi dihantui rasa khawatir atap roboh. Kami akan pastikan tim segera memvalidasi kerusakan tersebut," tegas Gubernur Jawa Barat di hadapan awak media.</p>
                <p>Respons responsif ini membatalkan skeptisisme masyarakat perbatasan bahwa mereka kerap dinomorduakan dalam pemerataan pembangunan.</p>

                <h3>Integrasi dengan Program "Moving Class"</h3>
                <p>Aduan ini menjadi sangat krusial mengingat SMAN 1 Tenjo menerapkan sistem pembelajaran <em>Moving Class</em> demi mengakomodir ketidakseimbangan rasio rombongan belajar (30 rombel) dengan ketersediaan ruang kelas fisik yang hanya berjumlah 21 ruangan. Rusaknya satu atau dua kelas tentu sangat berdampak pada kelancaran irama sirkulasi belajar harian ratusan siswa.</p>
                <p>Kepala SMAN 1 Tenjo menyambut positif gerak cepat Pemprov Jabar. Beliau menjelaskan bahwa proposal revitalisasi sudah pernah diajukan, namun dengan intervensi langsung dari DPRD dan Gubernur, pelaksanaannya diproyeksikan dapat menggunakan instrumen dana tak terduga atau percepatan anggaran pada tahun ajaran ini.</p>
                
                <blockquote>"Tindakan proaktif pemerintah ini bukan cuma soal semen dan bata, tapi tentang mengembalikan marwah belajar yang nyaman dan kondusif bagi anak-anak kami di ujung Kabupaten Bogor," ujar seorang staf Bimbingan Konseling (BK) di SMAN 1 Tenjo saat ditemui di lapangan.</blockquote>

                <h3>Tindak Lanjut & Prioritas Penanganan</h3>
                <p>Berdasarkan informasi yang dihimpun tim Pojoksatu, anggaran revitalisasi ruang kelas di SMAN 1 Tenjo akan dimasukkan ke dalam plot prioritas Rencana Kerja Pemerintah Daerah (RKPD) Perubahan. Fokus utama rehabilitasi ini adalah penggantian struktur atap yang keropos, pembaruan instalasi listrik demi mendongkrak operasional perangkat <em>Smart Board</em>, dan memperkuat dinding luar.</p>
                <p>Masyarakat kecamatan Tenjo dan keluarga besar sekolah sangat mengapresiasi sinergi antara aspirasi wali murid, anggota dewan, hingga kebijakan eksekutif tingkat provinsi yang solid ini. Kini, civitas akademika SMAN 1 Tenjo tinggal menghitung waktu menuju era fasilitas yang jauh lebih layak, sebanding dengan semangat berprestasi siswanya!</p>
            ',
            'category_id' => $category->id,
            'is_featured' => true,
            'published_at' => now()->subHours(1),
            'source' => 'Pojoksatu Bogor',
            'journalist' => 'Tim Redaksi Pojoksatu',
            'image_url' => 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=2069&auto=format&fit=crop', // A nice dramatic photo of a newspaper/school building concept
        ];

        Article::create([
            'article_category_id' => $articleData['category_id'],
            'author_user_id' => $author->id ?? 1,
            'reviewer_user_id' => $author->id ?? 1,
            'title' => $articleData['title'],
            'slug' => Str::slug($articleData['title'].'-'.Str::random(4)),
            'excerpt' => $articleData['excerpt'],
            'body' => $articleData['body'],
            'status' => ArticleStatus::Published,
            'visibility' => PortfolioVisibility::Public,
            'is_featured' => $articleData['is_featured'],
            'approved_at' => $articleData['published_at'],
            'published_at' => $articleData['published_at'],
            'metadata' => [
                'source' => $articleData['source'],
                'journalist' => $articleData['journalist'],
                'image_url' => $articleData['image_url'],
            ],
        ]);

        $this->command->info('Artikel Pojoksatu "Respons Gubernur soal Kelas Rusak" berhasil dimasukkan!');
    }
}
