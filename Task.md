# Task Breakdown: Brand Campaigns Status Tabs & Draft Management System

Dokumen ini memuat pembagian milestone kerja secara bertahap (bite-sized milestones) untuk mempermudah eksekusi dan review satu per satu.

---

## Milestone 1: Backend - Endpoint Hapus Kampanye/Draf & Status Counts
Fokus: Menyediakan kemampuan soft-delete draf dan agregasi jumlah kampanye per status.

- [x] **1.1. Handler `DeleteCampaign` (`backend/src/features/campaign/campaign.handlers.ts`)**
  - Implementasi soft-delete (`status: Status.DELETED`) dengan fast-fail guards.
  - Auth check (401) -> Role check (403: Brand/Admin) -> Single-query ownership check (`where: { id, status: ACTIVE, brand: { accountId: account.sub } }`) (404) -> Soft-delete write.
  - Respon standar via `SendSuccess(res, null, 'Campaign successfully deleted.')`.
- [x] **1.2. Handler `GetCampaignStatusCounts` (`backend/src/features/campaign/campaign.handlers.ts`)**
  - Query agregasi cepat `prisma.campaign.groupBy` by `campaignStatus` untuk brand yang login.
  - Mengembalikan objek mapping jumlah, contoh: `{ DRAFT: 3, ACTIVE: 2, IN_REVIEW: 1, REVISION: 0, FINISHED: 1 }`.
- [x] **1.3. Register Routes (`backend/src/features/campaign/campaign.routes.ts`)**
  - Daftarkan `GET /counts` dan `DELETE /:id`.
- [x] **1.4. Verifikasi Backend**
  - Jalankan `npm run typecheck` di backend.

---

## Milestone 2: Frontend Data Layer & Type Definitions
Fokus: Menyiapkan interface murni, API client, dan TanStack Query hooks.

- [x] **2.1. Compile-time Type Definitions (`frontend/src/features/campaign/types.ts`)**
  - Interface `CampaignStatusCounts`.
  - Prop interfaces untuk: `CampaignStatusTabsProps`, `ResumeDraftBannerProps`, `DraftsSheetProps`, `DraftItemRowProps`.
- [x] **2.2. API Functions (`frontend/src/features/campaign/api.ts`)**
  - Fungsi `DeleteCampaign(id: string)`.
  - Fungsi `GetCampaignStatusCounts()`.
- [x] **2.3. Query & Mutation Hooks (`frontend/src/features/campaign/hooks/`)**
  - `UseCampaignStatusCountsQuery()` di `queries.ts`.
  - `UseDeleteCampaignMutation()` di `mutations.ts` dengan invalidation `['campaigns']` dan `['campaign-counts']`.
- [x] **2.4. Verifikasi Typecheck Frontend**
  - Jalankan `npx tsc --noEmit` di frontend.

---

## Milestone 3: Status Tabs dengan Sinkronisasi URL
Fokus: Navigasi tab status tanpa reload halaman dan bebas dari tampilan draf kosong.

- [ ] **3.1. Komponen `CampaignStatusTabs` (`frontend/src/features/campaign/components/CampaignStatusTabs.tsx`)**
  - Tab list: `Aktif` (`ACTIVE`), `Menunggu Review` (`IN_REVIEW`), `Perlu Revisi` (`REVISION`), `Selesai` (`FINISHED`).
  - Sinkronisasi dengan URL search params `?status=ACTIVE` (menggunakan `useSearchParams` dari React Router).
  - Menampilkan badge counter jumlah kampanye di tiap tab (misal: `Aktif (2)`).
  - Aksen visual peringatan (amber) pada tab `Perlu Revisi` jika ada item.
- [ ] **3.2. Integrasi ke `BrandCampaignsList` & `BrandCampaignsPage`**
  - Pasang `CampaignStatusTabs` di antara `CampaignsHeader` dan `BrandCampaignsList`.
  - `BrandCampaignsList` membaca filter status dari URL dan mengirimkannya ke `UseCampaignsQuery({ campaignStatus: currentStatus })`.
  - Empty state spesifik yang ramah untuk tiap status (misal: "Belum ada kampanye aktif").

---

## Milestone 4: Banner "Lanjutkan Draf" & Drawer (Side Sheet) Daftar Draf
Fokus: Penanganan draf yang elegan dan bersih tanpa merusak grid kartu utama.

- [ ] **4.1. Pasang Komponen `Sheet` Primitif (`frontend/src/components/ui/sheet.tsx`)**
  - Komponen resmi shadcn/ui untuk slide-out drawer dari kanan layar.
- [ ] **4.2. Komponen `ResumeDraftBanner` (`frontend/src/features/campaign/components/ResumeDraftBanner.tsx`)**
  - Hanya muncul jika `draftCount > 0`.
  - Menampilkan informasi draf terakhir yang diedit.
  - Jika 1 draf: Tombol `[Lanjutkan Draf]` + `[Hapus]`.
  - Jika > 1 draf: Tombol `[Lanjutkan Terakhir]` + tombol `[Lihat Semua Draf (X)]`.
- [ ] **4.3. Komponen `DraftsSheet` (`frontend/src/features/campaign/components/DraftsSheet.tsx`)**
  - Drawer slide-out yang menampilkan daftar semua draf yang belum selesai.
  - Tiap baris draf menampilkan: Judul, tanggal edit, status progres wizard, tombol `[Lanjutkan]`, dan tombol `[Hapus]` (dengan konfirmasi).
  - Memungkinkan pembersihan draf-draf kosong ("Kampanye Tanpa Judul").

---

## Milestone 5: Smart Draft Reminder pada Tombol "+ Buat Kampanye"
Fokus: Mencegah penumpukan draf kosong saat brand menekan tombol buat kampanye.

- [ ] **5.1. Update `CreateCampaignDialog` (`frontend/src/features/campaign/components/CreateCampaignDialog.tsx`)**
  - Cek jumlah draf aktif brand:
    - Jika 0 draf: Dialog konfirmasi standar untuk membuat kampanye baru.
    - Jika >= 1 draf: Tampilkan reminder ramah:
      - *"Anda masih memiliki X draf yang belum selesai. Mau lanjutkan draf sebelumnya atau buat kampanye baru?"*
      - Opsi aksi: `[Lanjutkan Draf Terakhir]`, `[Lihat Semua Draf]`, dan `[Tetap Buat Baru]`.

---

## Milestone 6: QA, Verifikasi & Dokumentasi
Fokus: Memastikan kode memenuhi standar AGENTS.md dengan nol error/warning.

- [ ] **6.1. Pengujian Fungsional End-to-End**
  - Tes perpindahan tab status dan URL sync.
  - Tes pembukaan wizard dari banner draf dan sheet draf.
  - Tes penghapusan draf (verifikasi kartu draf berkurang seketika).
  - Tes reminder pada tombol "+ Buat Kampanye".
- [ ] **6.2. Code Verification**
  - Backend: `npm run typecheck`
  - Frontend: `npx tsc --noEmit` & `npm run lint` & `npm run build`
- [ ] **6.3. Update Walkthrough & Dokumentasi**
