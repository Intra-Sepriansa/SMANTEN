import argparse
import sys
import os

try:
    import instaloader
except ImportError:
    print("Error: Instaloader tidak terpasang.")
    print("Silakan jalankan: pip install instaloader")
    sys.exit(1)

def download_instagram_images(username, limit=12):
    print(f"Memulai proses download dari akun IG: @{username}")
    print("Menghubungkan ke Instagram (Guest Mode)...")
    
    L = instaloader.Instaloader(
        download_videos=True,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        dirname_pattern=f"public/images/{username}"
    )

    try:
        profile = instaloader.Profile.from_username(L.context, username)
        
        print(f"Berhasil menemukan profil: {profile.full_name} ({profile.followers} Followers)")
        print(f"Mulai mendownload max {limit} postingan terbaru...\n")

        count = 0
        for post in profile.get_posts():
            if count >= limit:
                break
            
            L.download_post(post, target=profile.username)
            count += 1
            
        print(f"\nSelesai! {count} postingan telah disimpan di folder: public/images/{username}/")
        
    except instaloader.exceptions.ProfileNotExistsException:
        print(f"\nError: Profil '{username}' tidak ditemukan.")
    except instaloader.exceptions.ConnectionException as e:
        print(f"\nError Koneksi/Diblokir IG: {e}")
        print("\n[!] Instagram sering memblokir pencarian tanpa login.")
        print("[!] Solusi: Jalankan ulang script ini dengan login akun Anda.")
        print("    Contoh: instaloader --login=username_ig_anda sman1tenjo")

if __name__ == "__main__":
    download_instagram_images("sman1tenjo", 15)
