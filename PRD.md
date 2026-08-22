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
### 2.4 Clipper Account Linking
Clippers link a TikTok account before joining campaigns:
1. Clipper enters their TikTok username.
2. Platform generates a unique verification code.
3. Clipper places the code in their TikTok bio.
4. Platform verifies the code.

Additional rules:
- No periodic re-verification; the bio code is checked once more by the admin at final settlement (see [2.7](#27-settlement-and-payouts)).
- Architecture must not block adding Instagram Reels or YouTube Shorts in a later version.
### 2.5 Two-Stage Clip Submission

**Stage 1: Draft review**

1. Clipper uploads a draft video
2. Brand reviews the draft: approve, reject with a reason, or request revision.
3. Maximum 2 revision rounds per submission; after that the submission closes (the clipper may start a fresh submission).
4. There is no auto-approve; pending drafts trigger reminder notifications to the brand after 24 and 48 hours.

**Stage 2: Post and verify**
1. The approved clipper posts the video on their linked TikTok account.
2. Clipper submits the live video URL.
3. Platform verifies the URL belongs to the linked account.
4. View tracking starts.

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
   - Checks that the account's bio code still matches its linked account.
3. Per account, the review has two outcomes:
   - `Approved`: earnings are finalized and credited to the clipper's wallet balance.
   - `Rejected`: earnings are withheld and the clipper is notified with the reason (bio-code mismatch, invalid views, or other fraud flags).

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