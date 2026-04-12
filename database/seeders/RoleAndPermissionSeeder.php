<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            ['name' => 'Manage Users', 'slug' => 'manage_users', 'resource' => 'users'],
            ['name' => 'Manage Rooms', 'slug' => 'manage_rooms', 'resource' => 'rooms'],
            ['name' => 'Manage Timetables', 'slug' => 'manage_timetables', 'resource' => 'timetables'],
            ['name' => 'Review PPDB', 'slug' => 'review_ppdb', 'resource' => 'ppdb'],
            ['name' => 'Manage Portfolios', 'slug' => 'manage_portfolios', 'resource' => 'portfolio'],
            ['name' => 'Moderate Portfolios', 'slug' => 'moderate_portfolios', 'resource' => 'portfolio'],
            ['name' => 'Manage Organizations', 'slug' => 'manage_organizations', 'resource' => 'organization'],
            ['name' => 'Manage Articles', 'slug' => 'manage_articles', 'resource' => 'articles'],
            ['name' => 'Publish Articles', 'slug' => 'publish_articles', 'resource' => 'articles'],
            ['name' => 'Submit Portfolio', 'slug' => 'submit_portfolio', 'resource' => 'portfolio'],
        ];

        foreach ($permissions as $permission) {
            Permission::query()->updateOrCreate(
                ['slug' => $permission['slug']],
                $permission,
            );
        }

        $rolePermissions = [
            RoleName::SuperAdmin->value => collect($permissions)->pluck('slug')->all(),
            RoleName::OperatorSekolah->value => [
                'manage_rooms',
                'manage_timetables',
                'review_ppdb',
                'manage_organizations',
                'manage_articles',
                'publish_articles',
            ],
            RoleName::Guru->value => [
                'manage_timetables',
                'manage_portfolios',
                'moderate_portfolios',
                'manage_articles',
                'publish_articles',
            ],
            RoleName::StaffTu->value => ['review_ppdb'],
            RoleName::Siswa->value => ['submit_portfolio'],
            RoleName::WaliMurid->value => [],
            RoleName::JurnalisSiswa->value => ['manage_articles'],
            RoleName::Alumni->value => [],
        ];

        foreach ($rolePermissions as $slug => $permissionSlugs) {
            $role = Role::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => str($slug)->replace('_', ' ')->title()->toString(),
                    'description' => 'System role for '.$slug,
                    'is_system' => true,
                ],
            );

            $permissionIds = Permission::query()
                ->whereIn('slug', $permissionSlugs)
                ->pluck('id')
                ->all();

            $role->permissions()->sync($permissionIds);
        }
    }
}
