# Campaign Wizard Refactoring Guide & Architecture Blueprint

This document records all architectural patterns, UI/UX standards, and refactorings established during the **Campaign Wizard Layout**, **Step 1 (Basic Information)**, and **Supabase Native Streaming Upload** sessions. 

It serves as the definitive, step-by-step context and blueprint for refactoring the remaining steps (**Step 2: Materials**, **Step 3: Brief**, **Step 4: Reward**, and **Step 5: Review**) to ensure the entire campaign creation workflow remains unified, clean, and robust.

---

## 1. Executive Summary: What Changed in This Session

### A. Layout Orchestrator & Stepper Decoupling
1. **[CampaignWizardLayout.tsx](file:///c:/Projects/klipday/frontend/src/features/campaign/layouts/CampaignWizardLayout.tsx)**:
   - Reduced to ~60 lines of pure orchestration logic.
   - Missing Campaign ID guard: Redirects to `/dashboard/campaigns` if `!id`.
   - Provides unidirectional data flow via React Router's `<Outlet context={{ campaign }} />`.
2. **Extracted Dedicated Layout Subcomponents**:
   - **[CampaignWizardHeader.tsx](file:///c:/Projects/klipday/frontend/src/features/campaign/components/CampaignWizardHeader.tsx)**: Self-contained header with back navigation and title.
   - **[CampaignWizardSkeleton.tsx](file:///c:/Projects/klipday/frontend/src/features/campaign/components/CampaignWizardSkeleton.tsx)**: Zero-prop skeleton preventing Cumulative Layout Shift (CLS) during initial campaign fetch.
   - **[CampaignWizardError.tsx](file:///c:/Projects/klipday/frontend/src/features/campaign/components/CampaignWizardError.tsx)**: Isolated recovery UI with retry callback (`onRetry={refetch}`).
3. **Context Hook**:
   - **[wizard-context.ts](file:///c:/Projects/klipday/frontend/src/features/campaign/hooks/wizard-context.ts)**: Type-safe `UseCampaignWizardContext()` hook wrapping `useOutletContext<CampaignWizardContext>()`.

### B. Step 1 (Basic Information) Architecture & De-Noising
1. **Naming & Responsibility Alignment**:
   - Renamed orchestrator to **[CampaignStep1.tsx](file:///c:/Projects/klipday/frontend/src/features/campaign/pages/steps/CampaignStep1.tsx)** (matching feature conventions like `SignIn.tsx`).
   - Renamed form component to **[CampaignFormStep1.tsx](file:///c:/Projects/klipday/frontend/src/features/campaign/components/CampaignFormStep1.tsx)** (zero-prop, self-contained).
   - Deleted obsolete files: `Step1BasicInfo.tsx` and `BasicInfoForm.tsx`.
2. **UI/UX Refinement (De-Noising & Visual Hierarchy)**:
   - **Eliminated Duplicate Section Titles**: Stripped noisy micro-section headings (*"Identitas Kampanye"*, *"Kategori & Platform"*, etc.) and their paragraph descriptions that competed visually with field labels.
   - **Red Asterisks (`*`)**: Standardized `<span className="text-destructive font-medium">*</span>` on required labels.
   - **Balanced Typography**: Field descriptions scaled down to `text-xs text-muted-foreground/80 leading-relaxed`.
   - **Real-Time Counters**: Tabular character counters (`{(field.value ?? '').length}/100`) for title and description.
   - **Interactive Link Testing**: Quick "Uji Tautan" button with `ExternalLink` icon for valid URLs.
   - **Autofill Dark Mode Fix**: Added custom `-webkit-autofill` rules in `index.css` to prevent white flash and borders on dark inputs.

### C. Zero-Dependency Native Streaming Thumbnail Upload
1. **Backend Pipeline**:
   - **[campaign.routes.ts](file:///c:/Projects/klipday/backend/src/features/campaign/campaign.routes.ts)**: Added `POST /api/campaigns/:id/thumbnail`.
   - **[campaign.handlers.ts](file:///c:/Projects/klipday/backend/src/features/campaign/campaign.handlers.ts)**: Implemented `UploadCampaignThumbnail`:
     - Fast-fail guards: Auth (401), Role (403), single-query Ownership check (404).
     - Whitelisted MIME types (`image/jpeg`, `image/png`, `image/webp`) and Content-Length ($\le$ 5MB).
     - Real-time `TransformStream` byte counting: aborts immediately if stream exceeds 5MB (*Anti-DoS*).
     - Zero external dependencies: bridges Express `req` with `Readable.toWeb(req)` into native Node.js `fetch` with `duplex: 'half'`.
     - **Deferred Database Commit**: Upload endpoint only stores file in Supabase Storage and returns `{ url }`. Database commit occurs atomically when the user clicks *"Simpan & Lanjutkan"*.
2. **Frontend UI**:
   - **[CampaignThumbnailUpload.tsx](file:///c:/Projects/klipday/frontend/src/features/campaign/components/CampaignThumbnailUpload.tsx)**:
     - Drag-and-drop dropzone with live upload progress bar.
     - Client-side size & MIME pre-validation.
     - Clean 16:9 preview with always-visible high-contrast action bar and hover overlay (`bg-red-600` delete button).

---

## 2. Core Architectural Golden Rules for All Campaign Steps

Every upcoming step (Step 2, Step 3, Step 4, Step 5) **MUST** follow these exact architectural conventions:

```
                  ┌──────────────────────────────────────────────┐
                  │          CampaignStepX.tsx (Page)            │
                  │   - Pure orchestrator (~25-30 lines)         │
                  │   - Card shell: CardHeader & CardTitle       │
                  │   - Zero local state, zero complex UI        │
                  └──────────────────────┬───────────────────────┘
                                         │ renders
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │        CampaignFormStepX.tsx (Component)     │
                  │   - Zero props (self-contained)              │
                  │   - Owns useForm() + zodResolver             │
                  │   - Reads UseCampaignWizardContext()         │
                  │   - Connects to UseEditCampaignMutation()    │
                  │   - Guarded submit (401, !id, isPending)     │
                  └──────────────────────┬───────────────────────┘
                                         │ dispatches to
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │    Subcomponents / Dynamic Field Groups      │
                  │   - Focused, single-responsibility           │
                  │   - Props interfaces extracted to types.ts   │
                  │   - Helpers / default mappers in utils/      │
                  └──────────────────────────────────────────────┘
```

### Rule 1: Page as Pure Orchestrator (`CampaignStepX.tsx`)
- Lives in `frontend/src/features/campaign/pages/steps/CampaignStepX.tsx`.
- Contains only the `<Card>` wrapper, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, and renders `<CampaignFormStepX />` inside `<CardContent>`.
- Does **not** fetch data directly; data is passed via layout context.

### Rule 2: Form as Self-Contained Worker (`CampaignFormStepX.tsx`)
- Lives in `frontend/src/features/campaign/components/CampaignFormStepX.tsx`.
- Has **zero required props** (`export function CampaignFormStepX()`).
- Reads `campaign` from `UseCampaignWizardContext()`.
- Extracts `id` from `useParams<{ id?: string }>()`.
- Directly initiates `editMutation = UseEditCampaignMutation(id)`.
- Handles form reset with `useEffect` when `campaign` changes.
- Guards submission:
  ```typescript
  if (!id || editMutation.isPending) return;
  ```
- On success, the mutation automatically invalidates the query cache and navigates to the next step.

### Rule 3: Single-Source Type Exports (`types.ts`)
- All component prop interfaces (e.g. `MaterialFieldGroupProps`, `BriefDynamicListFieldProps`) **must be defined in `types.ts`**, not locally inside component files.
- `types.ts` is strictly for pure compile-time types (zero runtime footprint). Derived types (`z.infer`) remain colocated in `schemas/` and can be re-exported if needed.

### Rule 4: Data Transformation in `utils/`
- Functions responsible for extracting initial form values from the campaign entity (e.g., `GetInitialMaterials`, `GetInitialBrief`, `GetInitialReward`) must live in `src/features/campaign/utils/`.
- Never write complex mapping logic inline inside form components.

### Rule 5: UI & Accessibility Standards
- **Labels**: Mandatory fields always have `<span className="text-destructive font-medium">*</span>`.
- **Field Descriptions**: Muted, readable font (`text-xs text-muted-foreground/80 leading-relaxed`).
- **Destructive Actions**: Delete / remove buttons must use high-contrast solid styling (`bg-red-600 hover:bg-red-700 text-white font-medium shadow-xs border border-red-500/40`), never washed-out transparent tints.
- **Button Controls**: Primary submission button always displays loading spinner (`<Loader2 className="size-4 animate-spin" />`) and disabled state when `isPending || formState.isSubmitting`.

---

## 3. Step-by-Step Refactoring Plan for Remaining Steps

### Step 2: Materi Kampanye (Materials & Assets)

#### Objectives:
- Transition from `Step2Materials.tsx` / `MaterialsForm.tsx` to `CampaignStep2.tsx` / `CampaignFormStep2.tsx`.
- Enable brands to upload, manage, and validate footage, images, and guidelines.

#### Action Items:
1. **Rename Files**:
   - `frontend/src/features/campaign/pages/steps/Step2Materials.tsx` $\rightarrow$ `CampaignStep2.tsx`.
   - `frontend/src/features/campaign/components/MaterialsForm.tsx` $\rightarrow$ `CampaignFormStep2.tsx`.
2. **Page Orchestrator (`CampaignStep2.tsx`)**:
   - Pure shell rendering `<CampaignFormStep2 />` inside standard `<Card>`.
3. **Form Component (`CampaignFormStep2.tsx`)**:
   - Remove passed props (`initialData`, `onSubmit`, `onBack`, `isPending`).
   - Use `useFieldArray` from `react-hook-form` to manage the list of materials.
   - Use `GetInitialMaterials(campaign)` from `utils/campaign-materials.ts` for default values.
   - Connect directly to `UseEditCampaignMutation(id)`.
4. **Subcomponent Polish (`MaterialFieldGroup.tsx`)**:
   - Ensure props interface `MaterialFieldGroupProps` is imported from `types.ts`.
   - Add high-contrast delete button (`bg-red-600`) for removing material rows.
   - Integrate with Supabase Storage if material files are uploaded directly, or support external drive/cloud links (Google Drive, Dropbox, TikTok).
5. **Validation (`materials-schema.ts`)**:
   - Validate that each material item has a non-empty name, valid type (`VIDEO`, `IMAGE`, `DOCUMENT`, `LINK`), and valid URL.

---

### Step 3: Brief & Panduan Kampanye (Brief & Guidelines)

#### Objectives:
- Transition from `Step3Brief.tsx` / `BriefForm.tsx` to `CampaignStep3.tsx` / `CampaignFormStep3.tsx`.
- Cleanly capture campaign purpose, core message, call to action, dos & don'ts, and required hashtags.

#### Action Items:
1. **Rename Files**:
   - `frontend/src/features/campaign/pages/steps/Step3Brief.tsx` $\rightarrow$ `CampaignStep3.tsx`.
   - `frontend/src/features/campaign/components/BriefForm.tsx` $\rightarrow$ `CampaignFormStep3.tsx`.
2. **Page Orchestrator (`CampaignStep3.tsx`)**:
   - Pure shell rendering `<CampaignFormStep3 />`.
3. **Form Component (`CampaignFormStep3.tsx`)**:
   - Self-contained, zero-prop.
   - Default values extracted via `GetInitialBrief(campaign)` in `utils/campaign-brief.ts`.
   - Textareas with real-time character counters for `purpose`, `keyMessage`, `narration`, and `callToAction`.
4. **Dynamic Tag / List Inputs (`BriefDynamicListField.tsx`)**:
   - Reusable tag/pill inputs for:
     - `hashtags` (with automatic `#` prefixing).
     - `mentionTags` (with automatic `@` prefixing).
     - `dos` (list of allowed/recommended practices).
     - `donts` (list of prohibited practices).
   - Props interface `BriefDynamicListFieldProps` extracted to `types.ts`.
   - Enter-key support for rapid item addition and high-contrast remove icons.

---

### Step 4: Hadiah & Anggaran (Reward & Budget)

#### Objectives:
- Transition from `Step4Reward.tsx` / `RewardForm.tsx` to `CampaignStep4.tsx` / `CampaignFormStep4.tsx`.
- Configure CPM, min/max views, campaign budget, and schedule dates with live mathematical projections.

#### Action Items:
1. **Rename Files**:
   - `frontend/src/features/campaign/pages/steps/Step4Reward.tsx` $\rightarrow$ `CampaignStep4.tsx`.
   - `frontend/src/features/campaign/components/RewardForm.tsx` $\rightarrow$ `CampaignFormStep4.tsx`.
2. **Page Orchestrator (`CampaignStep4.tsx`)**:
   - Pure shell rendering `<CampaignFormStep4 />`.
3. **Form Component (`CampaignFormStep4.tsx`)**:
   - Self-contained, zero-prop.
   - Default values extracted via `GetInitialReward(campaign)` in `utils/campaign-reward.ts`.
   - Number inputs with Rupiah formatting hints (`FormatRupiah`).
4. **Live Projection Calculator**:
   - Use `CalculateCampaignProjections(values)` from `utils/campaign-reward.ts`.
   - Shows real-time calculated metrics:
     - Minimum views needed to earn.
     - Maximum earnings per video clip.
     - Estimated funded videos within budget.
     - Campaign duration in days.
   - Fix React Compiler lint warning: use controlled subscription or `useWatch` rather than raw `form.watch()`.

---

### Step 5: Tinjau & Ajukan (Review & Submit)

#### Objectives:
- Transition from `Step5Review.tsx` / `ReviewSummary.tsx` to `CampaignStep5.tsx` / `CampaignFormStep5.tsx`.
- Provide a clear, comprehensive summary of all 4 previous steps with completion status indicators and final submission to admin review.

#### Action Items:
1. **Rename Files**:
   - `frontend/src/features/campaign/pages/steps/Step5Review.tsx` $\rightarrow$ `CampaignStep5.tsx`.
   - `frontend/src/features/campaign/components/ReviewSummary.tsx` $\rightarrow$ `CampaignReviewSummary.tsx`.
2. **Page Orchestrator (`CampaignStep5.tsx`)**:
   - Pure shell rendering `<CampaignReviewSummary />`.
3. **Summary Component (`CampaignReviewSummary.tsx`)**:
   - Reads `campaign` from `UseCampaignWizardContext()`.
   - Uses `ValidateCampaignCompleteness(campaign)` from `utils/campaign-review.ts`.
   - Renders 4 structured review sections:
     1. **Informasi Dasar**: Thumbnail preview, title, category, platform, media link.
     2. **Materi Kampanye**: List of uploaded assets with types and links.
     3. **Brief & Panduan**: Guidelines, key message, CTA, tags, dos & don'ts.
     4. **Hadiah & Anggaran**: CPM, budget, view limits, and date range.
   - Each section has an **"Ubah"** (Edit) link that jumps directly back to the respective step (`step-1`, `step-2`, `step-3`, or `step-4`).
4. **Submission Action**:
   - Connects to `UseSubmitCampaignMutation(id)`.
   - Calls backend `POST /api/campaigns/:id/submit`.
   - If any step is incomplete, disables the submit button and renders a clear warning alert listing the missing items.
   - On success, redirects to `/dashboard/campaigns` with a success toast notification.

---

## 4. Router & Navigation Integration (`App.tsx`)

When updating routes, use consistent naming importing directly from the step orchestrator pages:

```tsx
// frontend/src/App.tsx
import CampaignStep1 from './features/campaign/pages/steps/CampaignStep1';
import CampaignStep2 from './features/campaign/pages/steps/CampaignStep2';
import CampaignStep3 from './features/campaign/pages/steps/CampaignStep3';
import CampaignStep4 from './features/campaign/pages/steps/CampaignStep4';
import CampaignStep5 from './features/campaign/pages/steps/CampaignStep5';

// Inside router config:
<Route path=":id" element={<CampaignWizardLayout />}>
  <Route index element={<Navigate to="step-1" replace />} />
  <Route path="step-1" element={<CampaignStep1 />} />
  <Route path="step-2" element={<CampaignStep2 />} />
  <Route path="step-3" element={<CampaignStep3 />} />
  <Route path="step-4" element={<CampaignStep4 />} />
  <Route path="step-5" element={<CampaignStep5 />} />
</Route>
```

---

## 5. Verification Checklist for Every Step

Before reporting any step refactoring as complete, run and verify:

```powershell
# 1. Backend Typecheck
cd c:\Projects\klipday\backend
npm run typecheck

# 2. Frontend Typecheck
cd c:\Projects\klipday\frontend
npx tsc --noEmit

# 3. Frontend Linter
npm run lint

# 4. Frontend Production Build
npm run build
```

---

*Document created on 2026-09-10. Use this guide as the direct baseline for refactoring Step 2 (Materials) and subsequent steps.*
