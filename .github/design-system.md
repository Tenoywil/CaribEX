## Caribx UI Design System & Direction

### 1. Core Color System

| Purpose                | Color                                              | Hex                                                       | Notes                                                            |
| ---------------------- | -------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| **Primary**            | Caribbean Blue                                     | `#0074F0`                                                 | Inspired by Coinbase blue — used for buttons, highlights, links. |
| **Primary Gradient**   | `linear-gradient(90deg, #0074F0 0%, #00C2FF 100%)` | Adds vibrancy and depth for banners and CTAs.             |                                                                  |
| **Secondary**          | Emerald Green                                      | `#00B878`                                                 | Symbolizes growth, finance, and prosperity.                      |
| **Accent**             | Gold Amber                                         | `#F5B700`                                                 | For success states, premium listings, and product emphasis.      |
| **Background (Light)** | `#F9FAFB`                                          | Clean neutral background like Coinbase.                   |                                                                  |
| **Surface / Card BG**  | `#FFFFFF`                                          | White with soft shadows — gives depth without clutter.    |                                                                  |
| **Text Primary**       | `#0E1116`                                          | Deep graphite gray, easy on eyes.                         |                                                                  |
| **Text Secondary**     | `#4B5563`                                          | For descriptions and secondary labels.                    |                                                                  |
| **Border / Divider**   | `#E5E7EB`                                          | Subtle neutral gray to separate content.                  |                                                                  |
| **Error / Danger**     | `#EF4444`                                          | Clear red tone for transaction or payment errors.         |                                                                  |
| **Warning**            | `#F59E0B`                                          | For pending or cautionary states.                         |                                                                  |
| **Success**            | `#10B981`                                          | Matches the green tone of trust and financial completion. |                                                                  |

### 2. Design Direction

#### a. Overall Style

* **Structure:** Grid-based, minimalist layouts — like Coinbase.
* **Typography:**

  * Headings: `Inter Bold` or `Space Grotesk`.
  * Body: `Inter Regular`.
* **Spacing:** 8–16px rhythm system.
* **Shadows:** `0 1px 3px rgba(0,0,0,0.08)`.
* **Radii:** Rounded corners at `12px`.

#### b. UI Components

| Component            | Direction                                                                            |
| -------------------- | ------------------------------------------------------------------------------------ |
| **Navbar**           | Sticky top navbar with search bar (Amazon-like) and profile/actions (Coinbase-like). |
| **Market Cards**     | White background, product images, badges (`Hot`, `Verified`, `Crypto-only`).         |
| **Primary Button**   | Blue background, white text, rounded `8px`, hover gradient.                          |
| **Secondary Button** | Outline style using Caribbean Blue, hover fill.                                      |
| **Tabs & Filters**   | Flat minimal, hover states.                                                          |
| **Tables / Data**    | White rows, zebra striping, hover glow.                                              |
| **Charts / Wallet**  | Rounded containers, blue gradient top headers.                                       |
| **Badges / Tags**    | Emerald Green for active, Amber for trending, Gray for inactive.                     |

#### c. Layout Concept

* **Hero Section:** Blue gradient banner, geometric Caribbean pattern, tagline: *“Empowering Caribbean Trade & Finance”*.
* **Marketplace Grid:**

  * Sidebar filters (Category, Price, Region, Payment Type)
  * 3–4 column product grid
  * Featured carousel on top.
* **Wallet / Dashboard:** Coinbase-like analytics cards, soft gradient charts, clear CTAs.

#### d. Iconography & Illustrations

* Use `Lucide` or `Heroicons`.
* Illustrations: Abstract Caribbean themes (waves, palms, sunlight).
* Use Lottie animations for transaction success.

#### e. Motion & Feedback

* **Framer Motion:** Entrance and hover transitions (opacity + translateY 10px).
* **Hover:** `scale(1.02)` + soft glow.
* **Transaction Confirmations:** Blue/green wave pulse animation.

### 3. Theme Variants

#### Light Mode (Default)

* White space, cool blues, financial trust palette.

#### Dark Mode

| Element        | Color             |
| -------------- | ----------------- |
| **Background** | `#0B1120`         |
| **Cards**      | `#111827`         |
| **Text**       | `#E5E7EB`         |
| **Primary**    | `#3B82F6`         |
| **Accent**     | `#FACC15`         |
| **Shadow**     | `rgba(0,0,0,0.6)` |

Charts and gradients gain neon-like contrast.

### 4. Brand Identity Add-ons

* **Logo:** Minimal geometric “C” or coin/map pin fusion.
* **Font pairing:** Bold sans-serif heading + light subtext.
* **Tone:** Trustworthy, innovative, regional pride.
* **Imagery:** Caribbean trade, entrepreneurs, digital finance.

### 5. Implementation Notes

```ts
// theme.ts
export const colors = {
  primary: '#0074F0',
  primaryGradient: 'linear-gradient(90deg, #0074F0 0%, #00C2FF 100%)',
  secondary: '#00B878',
  accent: '#F5B700',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  textPrimary: '#0E1116',
  textSecondary: '#4B5563',
  border: '#E5E7EB',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
};
```

* Reuse Coinbase-inspired grid and typography.
* Layer Amazon’s category navigation and product density for market sections.

---

**Design Goal:** Create a hybrid experience that merges **Coinbase’s trust and clarity** with **Amazon’s market dynamics**, grounded in **Caribbean innovation and culture.**
