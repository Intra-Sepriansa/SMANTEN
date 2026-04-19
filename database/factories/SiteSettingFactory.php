<?php

namespace Database\Factories;

use App\Models\SiteSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SiteSetting>
 */
class SiteSettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'key' => fake()->unique()->slug(2),
            'value' => [
                'generated' => true,
            ],
        ];
    }

    public function publicPortal(array $overrides = []): static
    {
        return $this->state(fn () => [
            'key' => SiteSetting::PUBLIC_PORTAL_KEY,
            'value' => array_replace_recursive([
                'hero' => [
                    'slides' => [
                        [
                            'image' => '/images/sekolah/guru_mengajar.jpg',
                            'title' => 'Mendukung Sosialisasi Kurikulum Merdeka Belajar',
                            'subtitle' => 'Menyiapkan generasi unggul',
                        ],
                        [
                            'image' => '/images/sekolah/murid_belajar.jpg',
                            'title' => 'Pembelajaran Hidup dan Adaptif',
                            'subtitle' => 'Tampil digital dan berkarakter',
                        ],
                        [
                            'image' => '/images/sekolah/fasilitas_lab.jpg',
                            'title' => 'Fasilitas Belajar Modern',
                            'subtitle' => 'Dukung penuh inovasi siswa',
                        ],
                        [
                            'image' => '/images/sekolah/kegiatan_siswa.jpg',
                            'title' => 'Ekstrakurikuler Dinamis',
                            'subtitle' => 'Gali potensi dan bakat sejati',
                        ],
                    ],
                    'primary_cta' => [
                        'label' => 'Cek Beritanya',
                        'href' => '/berita',
                    ],
                ],
                'navigation' => [
                    'items' => [
                        [
                            'href' => '/',
                            'label' => 'Beranda',
                            'visible' => true,
                            'position' => 1,
                        ],
                        [
                            'href' => '/profil',
                            'label' => 'Profil',
                            'visible' => true,
                            'position' => 2,
                        ],
                        [
                            'href' => '/ppdb',
                            'label' => 'PPDB',
                            'visible' => true,
                            'position' => 3,
                        ],
                    ],
                ],
            ], $overrides),
        ]);
    }
}
