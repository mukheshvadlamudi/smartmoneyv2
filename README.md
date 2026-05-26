# 📊 Smart Money Workspace
### *by FutureLab Studios*

[![Next.js Framework](https://img.shields.io/badge/Framework-Next.js%2015-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React UI](https://img.shields.io/badge/Library-React%2019-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript Type-Safe](https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Google Gemini API](https://img.shields.io/badge/AI_Engine-Gemini_3.5_Flash-indigo?style=flat-square&logo=google-gemini)](https://ai.google.dev/)
[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

An ultra-premium, executive-grade personal wealth and investment workspace designed to organize compound capital, de-risk outstanding liabilities, simulate predictive timelines, and model long-term financial freedom. Crafted with modern, minimalist Apple-inspired aesthetics, tailored HSL color systems, and rich reactivity.

---

## 🌟 Core Product Features

### 1. 💼 Unified Investment Portfolio
* **Visual Allocation Wheel**: Dynamic SVG circular asset distribution visualization with hover sweeps.
* **Returns & CAGR Display**: High-visibility return rates inline next to asset titles (e.g., `+15.4% CAGR`).
* **Card-Based 2-Row Legends**: Grid-based legend cards separating the asset classification, colored dot, and compound CAGR return rate (Row 1) from the raw capital value and allocation share (Row 2), mitigating overlap and text collision.
* **Dynamic Integration**: Inline, 4-column quick adder form to instantly incorporate custom index holdings, hybrid funds, sovereign bonds, or cash reserves with custom risk profiles and expected returns.

### 2. ⚡ Reactive Future Simulator
* **Interactive Sliders**: Drag and slide parameters for Salary Hikes, Variable Expenses Cuts, and extra SIP Contributions.
* **Instant Reactivity**: Re-projects net cash runways, stress indicators, and custom goal milestones (e.g., Premium EV SUV timeline or International Luxury Travel Fund acceleration) *instantly as the sliders are dragged*.
* **Scenario Narrative Sandbox**: An AI sandbox where custom dilemmas can be typed or triggered via quick presets to generate detailed roadmap advice directly below the console.

### 3. 🛡️ Three-Person AI Board of Advisors
* **The Council Chamber**: Unified chat consultation console that submits financial dilemmas to three distinct AI board personas:
  * 🟢 **The Optimist (Growth Guardian)**: Highlights compounding upside, identifies aggressive market gains, and accelerates target milestones.
  * 🔴 **The Critic (Risk Sentinel)**: Stress-tests your leverage, flags dangerous liabilities, and demands strict emergency cushions.
  * 🟡 **The Manicured (Supreme Arbiter)**: Systematically balances growth against preservation to deliver a highly logical final verdict.
* **Offline Fallback Parsing**: Clean, single-layered fallback responses that keep the advisors fully operational even when no API keys are configured.

### 4. 📉 Debt Avalanche & Payoff Command
* **Interactive Payoff Comparison**: Select between the mathematically optimal **Avalanche** (rate-first) and psychologically supreme **Snowball** (balance-first) de-leveraging routes.
* **Interest Saved Sliders**: Adjust early sweep contributions to see projected timelines reduced and exact compound interest outlays saved in real-time.
* **Settle Lines**: Interactive buttons to de-link outstanding loans, credit cards, or home loan segments cleanly.

### 5. 🧠 Spending Intelligence & Anomaly Sweep
* **Emotional Context Logging**: Empathy-mapped ledger marking transactions with situational contexts like `stress-spending`, `impulse`, `normal`, or `weekend-spikes`.
* **Pattern Flags**: Visual indicator bentos highlighting anomalies (e.g., late-night gourmet food order loops or seasonal Steam sale splurges) with corrective coaching guidelines.
* **Safe Spend Daily/Weekly Registers**: Calculates absolute daily safe spending limits dynamically based on current net monthly cash flow surpluses.

---

## 🛠️ Technology Stack

1. **Framework & Engine**: [Next.js](https://nextjs.org/) (App Router, dynamic API server routing, Turbopack bundle optimizations)
2. **Frontend UI**: [React 19](https://react.dev/), [Lucide React](https://lucide.dev/) (Icons)
3. **Styling & Theme**: Vanilla CSS (Tailored variables, sleek dark modes, micro-animations, premium glassmorphism, responsive grid structures)
4. **AI Processing**: Google Gemini API via `@google/genai` (Structured JSON outputs, strict schema boundaries)
5. **Local Storage Persistence**: Active state caching to prevent page refresh loss with automatic structural check version upgrade overrides.

---

## 🚀 Quickstart & Setup

### Prerequisites
* **Node.js** (v18.x or above recommended)
* **NPM** or **Yarn**

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/mukheshvadlamudi/smartmoneyv2.git
cd smartmoneyv2
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory (or edit the existing one) and populate it with your Google AI Studio API key:
```env
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
```
*Note: If no API key is specified, the application automatically boots in **Mock Simulator Mode**, providing premium offline scenario advice without failing.*

### 3. Run Locally
Start the local Next.js development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to consult the dashboard.

### 4. Production Build Validation
Verify that the workspace compiles error-free under strict production guidelines:
```bash
npm run build
```

📅 *Smart Money — Refined for Premium Presentation. Ready for Vercel Deployment.*
