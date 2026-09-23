# Klipday: Product Requirements Document (PRD)

> Klipday is a marketplace where brands launch escrow-funded campaigns and clippers earn for every verified view their product videos get on TikTok.

---
## 1. Overview
### 1.1 Purpose

Klipday is a marketplace platform that connects product owners (brands and UMKM) with clippers. A brand creates a campaign with an escrowed budget to promote its product through short videos. Clippers pick up the campaign, produce a video that the brand approves, and post it on their own TikTok accounts. Earnings are calculated from verified views, so brands pay only for real results and clippers are guaranteed payment for approved work.

This document defines the requirements for Klipday's MVP, covering the complete cycle from campaign funding to clipper payout.
### 1.2 Target Users

| Role | Description |

|------|-------------|

| **Brand (UMKM / product owner)** | Wants viral TikTok promotion for their product without hiring a social media team; needs simple tooling that requires no marketing expertise. |

| **Clipper** | Anyone looking for side income by clipping and posting videos; no professional editing background required. If you can make engaging TikTok content, you can earn. |

| **Internal admin (founder)** | Manually reviews campaigns, settlements, and payouts during the pilot phase; processes stay manual until the volume justifies automation. |

---
## 2. Key Features
### 2.1 Authentication and Roles
- Sign up and log in with email and password only (credential login); passwords are stored hashed.
- Password reset via email link (required since there is no social login fallback).
- Each user chooses exactly one role at signup: `Brand` or `Clipper`.
- UI language: Bahasa Indonesia.
### 2.2 Brand Wallet and Funding
- Brands top up a wallet balance via an Indonesian payment gateway: bank transfer / virtual account, QRIS, and e-wallets.
- Campaigns are funded from the wallet balance; the balance must cover the full campaign budget before the campaign enters review.
- Unused escrow is refunded to the wallet after campaign settlement.
### 2.3 Campaign Creation and Launch (Brand)
**Campaign fields:**
- Clipping brief and guidelines
- Uploaded material (footage, product assets)
- Reward system (see below)
- Deadline and total budget

**Reward system, defined per campaign:**
- `CPM`: rupiah earned per 1,000 verified views
- `Min views`: a clip earns nothing below this threshold
- `Max views`: per-clip earning cap

**Admin review outcomes:**
- `Approved`: the campaign launches and its budget is locked in escrow.
- `Revision`: the campaign is returned to the brand with notes; the brand edits and resubmits.
- `Rejected`: the campaign is closed.

**Live phase:**
- When the escrowed budget is exhausted, the campaign is finished: it closes automatically and the brand is notified.
- There is no mid-campaign top-up; to continue promotion, the brand creates a new campaign.

### 2.3.1 Campaign Detail Experience & Role-Adaptive Navigation
- **Navigation & Lifecycle Redirection**:
  - Submitted campaigns with lifecycle status `IN_REVIEW`, `ACTIVE`, `FINISHED`, or `REJECTED` render the dedicated Campaign Detail page.
  - Incomplete or pending edit campaigns (`DRAFT`, `REVISION`) automatically redirect to their respective step in the campaign creation wizard.
- **Hero Banner & Media Card**:
  - Highlights brand profile, campaign title, prominent CPM rate display (`Rp{CPM} / 1K views`), platform icon, category badge, active timeline, joined creators count, and media preview card.
  - **Status Badge Role Guard**: Lifecycle status badges are displayed strictly for `BRAND` and `ADMIN` accounts. Clipper (`CREATOR`) accounts see public campaign information without internal status badges.
- **Role-Adaptive Tab Layout**:
  - **Tab 1: Detail** (Universal): Contains comprehensive campaign overview, creative brief & social posting rules (with one-click copy for captions, hashtags, and mentions), downloadable editing materials (footage, visual assets, reference links), sample clip inspiration, and a sticky financial/reward metrics sidebar (CPM, min/max views cap, budget burn progress bar, escrow guarantee).
  - **Tab 2: Role-Adaptive Workflow**:
    - `CREATOR`: 'Video Kamu' (tracks personal draft submission, revision notes, view counts, and payout status).
    - `BRAND`: 'Pengajuan Klip' (management queue of creator draft submissions for approval or revision requests).
    - `ADMIN`: Unified view containing both submissions queue and clipper progress reviews.
### 2.4 Clipper Account Linking & Bio Verification Handshake
Clippers link a TikTok account before submitting videos:
1. Clipper enters their TikTok username.
2. Platform generates a unique one-time verification token (`KD-XXXX`, 10-minute expiry, 60-second CDN propagation cooldown).
3. Clipper places the code in their TikTok bio and saves the profile.
4. Platform scrapes the live TikTok bio and confirms code match.
5. Anti-hijacking security guard: each TikTok handle is strictly unique (`@@unique([platform, username])`) and cannot be claimed by multiple creators.
6. Once verified, the account is permanently tied to the creator and the bio code may be removed immediately from TikTok.
7. Architecture is modular (`ISocialScraperProvider`) supporting ScrapeCreators adapter and local mock provider.

### 2.5 Pure Post-First Video Submission Workflow
Klipday uses the pure **Post-First Model** (matching Konten.com & Clippo.id standards): creators produce and publish their video directly to TikTok first, then submit the live video link via a 4-step wizard with persistent draft recovery:

- **Stage 0: Joining Campaign (`JOINED`)**
  - Creator clicks "Gabung Kampanye" on the Campaign Detail page.
  - Creates a placeholder `Submission` row with status `JOINED`, unlocking the "Kirim Video" button.
  - Brand submission review queues exclude `JOINED` records to keep tables clean.

- **4-Step Video Submission Wizard (`/campaigns/:id/submit`):**
  - **Step 1: Brief & Ketentuan**: Creative brief guidelines, required hashtags/mentions, dos & don'ts, and mandatory compliance agreement checkbox.
  - **Step 2: Akun TikTok**: Account verification step. Automatically recognizes and presents already verified TikTok accounts with a one-click continuation button.
  - **Step 3: Pilih Video**: Visual gallery of recent videos fetched directly from the linked TikTok account, plus a manual URL fallback accordion with author validation. Selection autosaves as a draft.
  - **Step 4: Pratinjau & Kirim**: Overview screen displaying video thumbnail, caption, live TikTok link, and manual curation advisory. Submitting transitions status to `PENDING_REVIEW` and stamps `submittedAt`.

- **Curation Review**:
  - Brand reviews the live submitted video: approve, request revision, or reject.
  - Maximum 2 revision rounds per submission.
  - Approved submissions enter view tracking.

**Limit:** one earning clip per clipper per campaign.

### 2.6 View Tracking and Earnings

- View counts are collected daily via a third-party scraper API; the admin verifies final counts at settlement.
- Earnings per clip = verified views × CPM, subject to three limits:
  - Counting starts only above the campaign's min-views threshold.
  - Earnings stop at the campaign's max-views cap.
  - Earnings are capped by the campaign's remaining budget.
- Views stop counting the moment the budget reaches zero (first come, first served) or the deadline passes, whichever comes first.
- Campaign end triggers the final report and settlement (see [2.7](#27-settlement-and-payouts)).
- Ledger edge cases (for example, an overnight view spike crossing the budget cutoff) will be resolved in the technical specification.

### 2.7 Settlement and Payouts

**Step 1: Settlement (at campaign end)**

1. System generates the campaign's final report: the list of accounts that successfully finished the campaign, each with final performance (verified views) and estimated earnings.
2. Admin reviews each account in the report:
   - Verifies the final view counts.
   - Verifies video ownership matches the verified account.
3. Per account, the review has two outcomes:
   - `Approved`: earnings are finalized and credited to the clipper's wallet balance.
   - `Rejected`: earnings are withheld and the clipper is notified with the reason (invalid views, copyright issues, or other fraud flags).

**Step 2: Payout (anytime, clipper-initiated)**

1. A clipper can request a payout whenever their wallet balance has money, subject to the rules below.
2. For the MVP, the admin executes payouts manually to the clipper's bank account or e-wallet; automated disbursement comes later, when the manual process reaches its limit.

**Payout rules:**
- Minimum payout: Rp50,000; smaller balances stay in the wallet.
- Payouts are processed within up to 7 days of the request (fraud-review buffer).

### 2.8 Notifications
- **Channels:** email and in-app.
- **Events:** draft-review reminders (24h / 48h), submission status changes, campaign launched / finished, escrow exhausted, payout sent.

### 2.9 Admin Console (Internal)
- Campaign review queue (approve / revision / reject).
- Final settlement review per campaign, including bio-code verification.
- Manual payout execution.
- Dispute flag queue with manual resolution.
### 2.10 Campaign Reporting (Brand)
- Live dashboard: submissions received, per-clip views and accrued earnings, budget burn rate.
- Final report at settlement: total views, total paid, per-clip breakdown.

---
## 3. Success Metrics

**Validation gate (before building the marketplace):** 3 paid pilot campaigns run manually in a concierge mode.

| Metric | Target (6 months post-launch) |

|--------|-------------------------------|

| North star (GMV) | IDR paid out to clippers per week, growing week over week |

| Activation | 70% or more of launched campaigns receive 5+ draft submissions within 72h |

| Brand responsiveness | Median draft review time under 48h (critical, since no auto-approve exists) |

| Brand retention | 30% or more launch a second campaign within 30 days |

| Clipper retention | 40% or more of paid clippers earn a second payout |

| Fraud | Under 5% of paid views flagged as invalid |

| Payout accuracy | 100% of finalized earnings paid to the correct verified account |


---
## Appendix A: Out of Scope (MVP)

- Social login (Google OAuth and similar); MVP uses email + password credentials only
- Instagram Reels / YouTube Shorts tracking
- Automated payout disbursement (manual admin payouts for MVP)
- Periodic account re-verification (bio code checked once at settlement)
- Mid-campaign budget top-up (an exhausted campaign is finished; the brand creates a new one)
- Multi-role accounts; auto-approve on pending drafts
- In-app chat, notification center, leaderboards, clipper tiers
- AI auto-clipping tools; product-sample logistics
- Agency accounts; native mobile app (mobile-web first)

## Appendix B: Open Questions
To be resolved at or before the specification phase:

- Which scraper API vendor, at what monthly cost?
- Payment gateway onboarding requirements (business entity / PT registration)
- CPM guidance ranges shown to brands (needs market data)