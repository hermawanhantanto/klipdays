import type { AudienceData, AudienceRole } from '../types'

export const DISCORD_INVITE_URL = 'https://discord.gg/tGN7YfwHH'

export const LANDING_CONTENT: Record<AudienceRole, AudienceData> = {
  CREATOR: {
    hero: {
      headline: 'Ubah Views,',
      headlineHighlight: 'Jadi Cuan.',
      subheadline:
        'Monetisasi keahlian edit videomu. Dapatkan cuan dari setiap views yang dihasilkan tanpa syarat minimal followers.',
      primaryCtaText: 'Mulai Jadi Creator',
      primaryCtaLink: '/signup?role=creator',
      secondaryCtaText: 'Gabung Discord',
      secondaryCtaLink: DISCORD_INVITE_URL,
      trustBadges: [
        { label: 'Tanpa Min. Followers' },
        { label: 'High CPM Rates' },
        { label: 'Payout Transparan' },
      ],
    },
    features: [
      {
        id: 'c-feat-1',
        title: 'Rate CPM Kompetitif',
        description:
          'Dapatkan potensi reward maksimal dari setiap views yang berhasil kamu kumpulkan sesuai rate CPM yang ditentukan brand.',
        iconName: 'TrendingUp',
      },
      {
        id: 'c-feat-2',
        title: 'Tanpa Minimal Followers',
        description:
          'Mulai hasilkan cuan dari akun nol. Fokus utama murni pada performa konten, kreativitas editing, dan jangkauan views.',
        iconName: 'Users2',
      },
      {
        id: 'c-feat-3',
        title: 'Penarikan Saldo Jelas',
        description:
          'Reward langsung masuk ke saldo wallet dan dapat ditarik ke bank atau e-wallet tanpa potongan biaya tersembunyi.',
        iconName: 'Wallet',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Pilih Campaign',
        description:
          'Telusuri brand aktif di dashboard dan pilih brief produk dengan rate CPM paling menarik sesuai niche favoritmu.',
        iconName: 'Compass',
      },
      {
        step: '02',
        title: 'Posting Video',
        description:
          'Buat potongan klip kreatif sesuai guideline, tambahkan hook menarik, dan upload ke akun media sosialmu.',
        iconName: 'Video',
      },
      {
        step: '03',
        title: 'Submit & Cairkan',
        description:
          'Masukkan URL postingan, kumpulkan views publik, dan tarik reward langsung ke rekening atau e-wallet pribadimu.',
        iconName: 'Coins',
      },
    ],
    community: {
      tagline: 'Komunitas Creator #1 Indonesia',
      headline: 'Bergabung dengan Komunitas Klipday',
      subheadline:
        'Dapatkan bocoran campaign dengan CPM tertinggi, tips edit video FYP, dan diskusi langsung dengan sesama creator.',
      ctaText: 'Gabung Discord Resmi',
      ctaLink: DISCORD_INVITE_URL,
      perks: [
        'Bocoran campaign rate CPM tertinggi sebelum rilis publik',
        'Sharing preset CapCut/Premiere & template hook FYP',
        'Diskusi interaktif & room review konten bareng top earners',
      ],
    },
    faq: [
      {
        question: 'Bagaimana cara menghitung reward dari sistem CPM?',
        answer:
          'Reward dihitung secara transparan berbasis performa views publik sesuai rate CPM yang ditentukan brand. Brand dapat menentukan rate CPM, batas minimal views, hingga batas maksimal reward per video secara fleksibel.',
      },
      {
        question: 'Apakah akun baru tanpa followers bisa ikut?',
        answer:
          'Ya, tidak ada syarat minimal followers. Penilaian reward murni berdasarkan jumlah views organik yang didapatkan klipmu.',
      },
      {
        question: 'Berapa minimal saldo untuk penarikan dana?',
        answer:
          'Minimal penarikan saldo sangat terjangkau (mulai Rp50.000) dan proses penarikan dilakukan langsung ke rekening bank atau e-wallet kamu.',
      },
      {
        question: 'Platform media sosial apa saja yang didukung?',
        answer:
          'Format video pendek di TikTok, Instagram Reels, dan YouTube Shorts sesuai dengan syarat masing-masing campaign.',
      },
    ],
    finalCta: {
      tagline: 'Mulai Menghasilkan Hari Ini',
      headline: 'Siap Monetisasi Kemampuan Video Editingmu?',
      subheadline:
        'Daftar gratis dalam 2 menit. Pilih campaign brand favorit dan ubah setiap views menjadi cuan.',
      ctaText: 'Mulai Jadi Creator Sekarang',
      ctaLink: '/signup?role=creator',
      secondaryText: 'Pelajari Keuntungan',
      secondaryLink: '#features',
    },
  },
  BRAND: {
    hero: {
      headline: 'Modal Terukur,',
      headlineHighlight: 'Viral Teratur.',
      subheadline:
        'Sebarkan narasi brand secara masif lewat jaringan creator aktif. Cukup bayar views yang benar-benar kamu dapatkan.',
      primaryCtaText: 'Buat Campaign Pertama',
      primaryCtaLink: '/signup?role=brand',
      secondaryCtaText: 'Konsultasi Campaign',
      secondaryCtaLink: DISCORD_INVITE_URL,
      trustBadges: [
        { label: 'Pay-per-Views (CPM)' },
        { label: 'Budget Pool Terkunci' },
        { label: 'Zero-Waste Budget' },
      ],
    },
    features: [
      {
        id: 'b-feat-1',
        title: 'Zero-Waste Marketing',
        description:
          'Eliminasi boncos. Hanya bayar views nyata yang berhasil dihasilkan creator (Model CPM) tanpa biaya slot tetap di muka.',
        iconName: 'Target',
      },
      {
        id: 'b-feat-2',
        title: 'Jangkauan Organik Masif',
        description:
          'Dapatkan puluhan hingga ratusan postingan dari berbagai akun secara serentak, mendominasi algoritma TikTok & Reels.',
        iconName: 'Sparkles',
      },
      {
        id: 'b-feat-3',
        title: 'Kontrol Campaign Fleksibel',
        description:
          'Atur brief, guideline konten, platform target, dan limit budget dengan mudah melalui dashboard analytics intuitif.',
        iconName: 'SlidersHorizontal',
      },
    ],
    howItWorks: [
      {
        step: '01',
        title: 'Buat Brief & Budget',
        description:
          'Tentukan kriteria konten, skema rate CPM fleksibel berbasis views, dan total budget pool yang dikunci dalam rekening bersama (rekber).',
        iconName: 'FileText',
      },
      {
        step: '02',
        title: 'Creator Bergerak',
        description:
          'Puluhan creator memproduksi dan menyebarkan konten kreatifmu di medsos dengan hashtag dan sound yang ditentukan.',
        iconName: 'Share2',
      },
      {
        step: '03',
        title: 'Panen Reach',
        description:
          'Pantau submission link, validasi konten, dan nikmati lonjakan organic traffic serta brand awareness instan.',
        iconName: 'BarChart3',
      },
    ],
    community: {
      tagline: 'Partner Pertumbuhan Brand',
      headline: 'Bergabung dengan Komunitas Klipday',
      subheadline:
        'Konsultasikan strategi viralitas, diskusikan formula brief efektif, dan terhubung langsung dengan tim kami.',
      ctaText: 'Konsultasi via Discord',
      ctaLink: DISCORD_INVITE_URL,
      perks: [
        'Konsultasi 1-on-1 pembuatan brief video viral bersama tim Klipday',
        'Akses prioritas ke Top 10% Verified Creators dengan views tertinggi',
        'Studi kasus strategi campaign sukses dari brand sejenis',
      ],
    },
    faq: [
      {
        question: 'Bagaimana cara menentukan budget dan rate CPM?',
        answer:
          'Kamu memiliki fleksibilitas penuh untuk menentukan alokasi budget, rate CPM, serta batas minimal dan maksimal views per video sesuai target dan strategi marketingmu.',
      },
      {
        question: 'Bagaimana jika budget campaign sudah habis?',
        answer:
          'Sistem akan otomatis menutup penerimaan submission baru sehingga kamu tidak akan mengalami over-budget atau tagihan tak terduga.',
      },
      {
        question: 'Bagaimana memastikan creator mematuhi brief?',
        answer:
          'Setiap creator wajib menyertakan link postingan yang dapat ditinjau untuk memastikan kepatuhan terhadap brief dan guideline brand.',
      },
      {
        question: 'Apakah konten yang di-upload aman untuk brand?',
        answer:
          'Kamu dapat menyertakan aturan ketat, do\'s & don\'ts, serta materi aset resmi pada deskripsi brief campaign sebelum creator mulai memproduksi.',
      },
    ],
    finalCta: {
      tagline: 'Dominasi Media Sosial',
      headline: 'Siap Mengakselerasi Brand Awareness Produkmu?',
      subheadline:
        'Luncurkan campaign pertamamu dalam hitungan menit. Hanya bayar views nyata yang kamu dapatkan dengan proteksi rekening bersama (rekber) 100%.',
      ctaText: 'Buat Campaign Pertama',
      ctaLink: '/signup?role=brand',
      secondaryText: 'Jadwalkan Konsultasi',
      secondaryLink: DISCORD_INVITE_URL,
    },
  },
}
