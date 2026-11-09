# GCC Foundation — Production-Grade East African Crowdfunding & Relief Platform

Modeled after the proven conversion layout of GoFundMe, engineered with **institutional transparency, direct hospital/school bursar payouts, line-item budget ledgers, and multi-currency East African payment rails (MTN Mobile Money, Airtel Money, Safaricom M-Pesa, Visa/Mastercard, PayPal)**.

Built in **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, and **TypeScript**. Strictly zero PHP.

---

## 🏛️ Brand Identity & Visual System

- **Primary Colors**:
  - Forest/Olive Green (`#3D5E16` / `#2F4812`) derived directly from the GCC Foundation logo
  - Warm Ochre/Gold (`#E28723` / `#D97706`) from the GCC Foundation logotype
  - Warm Off-White Canvas (`#FAF9F6`) and Crisp White Surfaces (`#FFFFFF`)
  - Hairline 1px Solid Borders (`#E5E7EB`)
- **Typography**:
  - Headings: Plus Jakarta Sans (warm, authoritative, editorial)
  - Body: DM Sans (crisp, highly legible)
  - Figures & Ledgers: Tabular numbers (`font-variant-numeric: tabular-nums`)
- **Official Logos**:
  - `public/images/gcc-emblem.png` (Multi-colored hands circle emblem)
  - `public/images/gcc-logo-full.jpg` (Full GCC Foundation official logo)

---

## 🛡️ Anti-AI & Anti-Scam Institutional Safeguards

1. **No "AI Slop" Aesthetics**: Clean editorial surfaces, zero neon glows, zero purple/blue gradients, and authentic documentary photo containers with date/location/officer stamps.
2. **100% Direct-to-Institution Payout Protocol**: Funds for surgeries or tuition are wired directly to verified hospital accounts (Uganda Heart Institute, St. Francis Hospital Nsambya, Mulago Complex) or school bursar accounts via Bank EFT—never unverified private hands.
3. **Itemized Line-Item Budget & Receipt Ledger**: Every campaign itemizes exact clinical or supply costs (e.g. Cardiopulmonary bypass kit: UGX 7,800,000; ICU bed: UGX 4,450,000) with stamped bank deposit slips and hospital receipts uploaded to the public ledger.
4. **4-Tier In-Person Field Vetting**:
   - Bedside/community inspection with timestamped photographic proof
   - Lead physician / bursar proforma invoice validation
   - National ID (NIN) & Local Council (LC1) recommendation letter clearance
   - Audited EFT bank disbursement with public ledger tracking
5. **100% Anti-Fraud Refund Guarantee**: Institutional guarantee refunding donors if any campaign misrepresentation is identified.

---

## 🚀 Key Features

- **Dynamic Currency Switcher**: Real-time conversion across `UGX` (Ugandan Shilling), `KES` (Kenyan Shilling), and `USD` ($).
- **GoFundMe 2-Column Sticky Campaign Page**:
  - Left Column (65%): Title, documentary photo gallery, Organizer & Beneficiary Identity Box with NIN checkmark, clinical narrative, line-item budget table, field updates chronological log, volunteer & material pledges tab, and solidarity comments wall.
  - Right Column (35% - Sticky Conversion Card): Tabular financial counter, animated progress bar, primary "Donate Now" CTA, WhatsApp / native share buttons, and live timestamped donor feed.
- **Unified On-Site Checkout Modal**:
  - One-Time Gift vs. Monthly Sustainer toggle
  - MTN Mobile Money (with simulated USSD prompt & countdown timer)
  - Airtel Money & Safaricom M-Pesa
  - International Credit/Debit Cards (Visa, Mastercard) & PayPal
  - Optional Platform Tip Slider (0% to 15%) with transparent note explaining why causes pay 0% fees
  - Celebration confetti burst and downloadable/printable official tax voucher
- **Material & Volunteer Pledge System**: Local supporters can pledge physical supplies (e.g., blood donation, cement bags, medical dressing) or volunteer hours.
- **Multi-Step Campaign Creation & KYC Portal**: Guided 4-step wizard with line-item budget calculator and National ID/proforma upload simulation.
- **Compliance Officer & Auditor Portal (`/admin`)**: Real-time inspection queue for compliance officers to audit proforma invoices, verify NINs, and authorize bank EFT tranches.
- **Our Team & Board (`/our-team`)**: Dedicated leadership page with real credentials, medical review board, and physical Nakasero headquarters address.
- **Public Ledger & Transparency (`/transparency`)**: Real-time bank EFT disbursement records and downloadable audit reports (KPMG East Africa).

---

## 💻 Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19 + TypeScript
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **Icons**: Lucide React
- **Confetti**: Canvas-Confetti

---

## 🏃‍♂️ How to Run Locally

```bash
# 1. Install dependencies (already completed)
npm install

# 2. Run local development server
npm run dev

# 3. Open browser at:
# http://localhost:3000
```

To build for production:
```bash
npm run build
npm run start
```
