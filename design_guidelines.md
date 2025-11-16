# Design Guidelines: Islamic Counseling & Spiritual Healing Platform

## Design Approach

**Hybrid Approach**: Drawing inspiration from wellness applications (Calm, Headspace) combined with authentic Islamic design principles to create a trustworthy, serene environment for spiritual and psychological guidance.

**Core Principles**:
- Serenity and spiritual comfort through generous whitespace
- Arabic-first design with appropriate RTL layouts
- Trust-building through traditional Islamic geometric patterns (subtle, not overwhelming)
- Privacy-centric UI without any login/account elements

---

## Typography System

**Arabic Typography** (Primary):
- Primary: 'Amiri' or 'Scheherazade New' via Google Fonts for Quranic verses and formal content
- Interface: 'Cairo' or 'Tajawal' for UI elements, body text, and navigation
- Hierarchy:
  - H1: 3xl to 4xl, semibold
  - H2: 2xl to 3xl, medium
  - Body: base to lg, regular
  - Quranic verses: xl to 2xl, Amiri font, leading-loose

---

## Layout & Spacing System

**Spacing Units**: Tailwind units of 4, 6, 8, 12, 16
- Consistent padding: p-6 for cards, p-8 for sections
- Vertical rhythm: space-y-6 for content groups, space-y-12 for sections
- Container: max-w-4xl for questionnaire and chat (centered, comfortable reading width)

---

## Component Library

### 1. **Welcome/Landing Section**
- Centered layout with Islamic geometric pattern overlay (SVG, very subtle)
- Large welcoming message emphasizing privacy and confidentiality
- Single prominent CTA button to begin questionnaire
- Brief explanation (2-3 sentences) of the service

### 2. **Questionnaire Interface**
- Multi-step form (one question per screen for focus)
- Progress indicator at top (simple dots or subtle progress bar)
- Question cards: generous padding (p-8), rounded corners (rounded-2xl)
- Input types: radio buttons, select dropdowns, text inputs
- Large, accessible form controls (min-h-12)
- Navigation: "السابق" (Previous) and "التالي" (Next) buttons at bottom
- Each question screen uses full viewport height with centered content

### 3. **Chat Interface**
- Two-column layout on desktop (lg:grid-cols-[280px_1fr]):
  - Sidebar: Session info, quick actions, disclaimer
  - Main: Chat area
- Single column on mobile (stacked)
- Chat messages:
  - User messages: aligned right, distinct styling
  - AI messages: aligned left with avatar icon (Islamic geometric pattern or simple icon)
  - Quranic verses: Special treatment with decorative borders, distinct typography (Amiri), tafkheem styling
  - Hadith references: Italicized with source attribution
- Message spacing: space-y-4 to space-y-6
- Input area: Fixed at bottom, elevated design, generous padding (p-6)

### 4. **Content Cards** (for guidance, dhikr, advice)
- Structured cards with clear sections:
  - Header with icon or category indicator
  - Main content area
  - Supporting text or references
- Rounded-2xl corners, shadow-lg
- Padding: p-6 to p-8
- Background: Subtle texture or pattern overlay (very light)

### 5. **Special Content Blocks**:

**Quranic Verse Display**:
- Border-r-4 (right border for RTL)
- Background with very subtle pattern
- Padding: p-6
- Translation below in smaller text
- Surah and Ayah reference

**Dhikr Recommendations**:
- List format with checkable items (visual only, not stored)
- Each item in a card: rounded-xl, p-4
- Count/repetition indicator
- Brief benefit explanation

**Scholar Quotes**:
- Blockquote styling with decorative quotation marks
- Scholar name and source
- Italicized or distinct typography

---

## Navigation & Structure

### Header (if included):
- Minimal: Logo/title on right (RTL), optional info icon on left
- Sticky positioning for questionnaire/chat
- Height: h-16 to h-20

### Footer:
- Simple, centered
- Disclaimer text about seeking professional help when needed
- No navigation links (single-purpose app)
- Padding: py-8

---

## Images

**Hero Section**: Yes - Use a calming, abstract Islamic geometric pattern or nature imagery (peaceful landscape, clouds, water) as background
- Placement: Welcome/landing screen
- Treatment: Overlay with subtle gradient for text readability
- Full-width, min-h-screen on landing

**Throughout App**: Minimal imagery focus, prioritize typography and white space

---

## Animations

**Minimal, Purposeful Only**:
- Smooth transitions between questionnaire steps (fade-in)
- Chat message appearance (subtle slide-up)
- Button hover states (built-in, no custom)
- Loading states for AI responses (simple pulse or dots)

---

## Accessibility & RTL

- Full RTL support for Arabic content
- Direction switching handled at root level
- Form labels and inputs properly aligned for RTL
- Icon positioning flipped for RTL context
- High contrast ratios throughout
- Focus states clearly visible on all interactive elements

---

## Key Screen Layouts

**1. Landing**: Centered content, max-w-2xl, full-height, hero image background
**2. Questionnaire**: Single question centered, max-w-xl, progress at top
**3. Chat**: Two-column (sidebar + messages), full-height layout with fixed input
**4. Results/Guidance**: Scrollable content cards, max-w-4xl, structured sections

---

**Design Philosophy**: Create a sanctuary-like digital space where users feel safe, respected, and spiritually supported through careful use of whitespace, traditional Islamic aesthetics, and privacy-first design choices.