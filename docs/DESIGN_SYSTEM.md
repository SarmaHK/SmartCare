# SmartCare UI/UX Design System

## 1. Design Philosophy
The SmartCare interface is designed to embody trust, professionalism, and clarity. As a medical appointment management system, the primary goal is frictionless user experience over visual novelty. 

**Core Tenets:**
- **Professional & Trustworthy**: Medical applications must instill confidence. The design avoids playful or overly flashy elements.
- **Clean & Minimal**: White space is used generously to reduce cognitive load, allowing medical data and appointments to stand out.
- **Classic & Modern**: A timeless layout structure (sidebar + header) combined with modern crisp typography and subtle interactions.
- **Accessible**: High contrast ratios, clear typography, and unambiguous feedback states are strictly enforced.

---

## 2. Color System
The color palette strictly avoids multi-colored accenting, dark themes, and heavy gradients.

### Dominant Colors
- **Background Base**: `#FFFFFF` (Pure White) - Used for all major content areas and cards.
- **Background Alternate**: `#F8FAFC` (Slate 50) - Used for app backgrounds to help white cards stand out.

### Primary Brand (Medical Blue)
Used for primary buttons, active states, and critical brand elements.
- **Primary Base**: `#1D4ED8` (Blue 700) - Strong, classic medical blue.
- **Primary Hover**: `#1E40AF` (Blue 800) - Darker shade for interaction feedback.
- **Primary Light**: `#DBEAFE` (Blue 100) - Used for subtle active backgrounds (e.g., active sidebar links).

### Neutral Grays (Typography & Borders)
- **Text Primary**: `#0F172A` (Slate 900) - Headers and primary reading text.
- **Text Secondary**: `#475569` (Slate 600) - Subtitles, descriptions, and table headers.
- **Borders/Dividers**: `#E2E8F0` (Slate 200) - Subtle lines to separate content without cluttering.

### Semantic Status Colors
Used strictly for badges and alerts. No heavy red layouts.
- **Success (Confirmed/Completed)**: `#059669` (Emerald 600) text on `#D1FAE5` (Emerald 100) background.
- **Warning (Pending)**: `#D97706` (Amber 600) text on `#FEF3C7` (Amber 100) background.
- **Danger (Cancelled/Error)**: `#DC2626` (Red 600) text on `#FEE2E2` (Red 100) background.

---

## 3. Typography Guide
**Font Family**: `Inter` (or system-ui fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`).

- **H1 (Page Titles)**: 24px (1.5rem), Font Weight 600 (Semibold), `#0F172A`.
- **H2 (Card Titles/Section Headers)**: 18px (1.125rem), Font Weight 600 (Semibold), `#0F172A`.
- **Body Primary**: 14px (0.875rem), Font Weight 400 (Regular), `#0F172A`.
- **Body Secondary**: 13px (0.8125rem), Font Weight 400 (Regular), `#475569`.
- **Small Labels/Table Headers**: 12px (0.75rem), Font Weight 500 (Medium), Uppercase tracking wide, `#475569`.

---

## 4. Spacing Guide
A strict 4px/8px baseline grid is enforced.
- **xs (4px)**: Micro spacing (e.g., icon to text).
- **sm (8px)**: Internal component spacing (e.g., form input to label).
- **md (16px)**: Standard padding for elements (e.g., buttons, card padding).
- **lg (24px)**: Section spacing within a card.
- **xl (32px)**: Spacing between separate cards or major page sections.

---

## 5. Component Guidelines

### Buttons
- **Primary Button**: Solid `#1D4ED8` background, white text, no border. Subtle shadow (`shadow-sm`).
- **Secondary/Outline Button**: Transparent background, `#E2E8F0` border, `#0F172A` text. Hover state shifts background to `#F8FAFC`.
- **Danger Button**: Only used for destructive actions (Delete/Cancel). Solid `#DC2626`.
- **Border Radius**: 6px (`rounded-md`) for a classic, professional feel. Avoid overly rounded "pill" shapes.

### Inputs & Forms
- **Style**: White background, `#E2E8F0` border, 6px border radius.
- **Focus State**: `ring-2` using the Primary Blue color with 20% opacity. Never use harsh black borders for focus.
- **Labels**: Always placed above the input field.

### Cards
- **Style**: White background, 1px `#E2E8F0` border, subtle shadow (`shadow-sm`), 8px border radius (`rounded-lg`).
- **No internal gradients**: Background must remain flat white.

### Tables
- **Style**: Edge-to-edge within cards.
- **Headers**: Light gray (`#F8FAFC`) background, 12px uppercase text.
- **Rows**: 1px bottom border (`#E2E8F0`). Subtle gray hover state on desktop.

### Modals
- **Overlay**: Dark gray overlay at 50% opacity (`#0F172A/50`) with background blur.
- **Dialog**: Centered, white background, maximum width 500px, explicit "X" close button in the top right.

### Badges (Status)
- **Style**: Small pill shape (`rounded-full`), 12px text, light background with darker text for the specific semantic color.

---

## 6. Layout Systems

### Authentication Layout (Login/Register)
- **Desktop**: Split screen. Left side contains a clean, professional medical stock image or solid Primary Blue with a simple tagline. Right side contains a vertically centered, clean white form.
- **Mobile**: Single column. White form centered on a light gray background.

### Portal Layouts (Patient, Doctor, Admin)
Standardized three-zone application shell.
1. **Sidebar (Left)**:
   - Width: 256px (`w-64`).
   - Background: White (`#FFFFFF`).
   - Border: 1px solid right border (`#E2E8F0`).
   - Content: Logo at top, navigation links below, logout at bottom.
2. **Top Header**:
   - Height: 64px (`h-16`).
   - Background: White (`#FFFFFF`).
   - Border: 1px solid bottom border (`#E2E8F0`).
   - Content: Breadcrumbs/Page Title on left, User Profile/Notifications on right.
3. **Content Area**:
   - Background: Light Slate (`#F8FAFC`).
   - Padding: 24px (`p-6`) around the main content wrapper.

---

## 7. Dashboard Layout Guidelines
Dashboards must prioritize information hierarchy:
1. **Top Row (Statistics Cards)**: 3-4 simple metric cards. E.g., "Total Appointments", "Pending Actions". Each card contains a label, a large number, and a subtle icon.
2. **Middle Row (Quick Actions & Summaries)**: Prominent buttons for high-frequency actions (e.g., "Book Appointment") paired alongside a mini-view of "Today's Schedule".
3. **Bottom Row (Data Tables)**: Recent activity or upcoming appointments formatted in clean, paginated tables.

---

## 8. UX Consistency Rules
- **Rule of 3 Clicks**: Any major action (Booking, Cancelling, Updating Status) must be reachable within 3 clicks from the dashboard.
- **Clear Feedback**: Every mutation (POST/PUT/DELETE) must yield a toast notification (Success or Error).
- **Destructive Actions**: Cancelling an appointment or deleting a user MUST require a confirmation Modal.
- **Empty States**: If a table has no data, show a friendly `EmptyState` component with an icon and a clear instruction (e.g., "No upcoming appointments. Click here to book one.").
- **Responsiveness**:
  - Desktop (>1024px): Sidebar is permanently visible.
  - Tablet/Mobile (<1024px): Sidebar collapses into a hamburger menu. Tables must allow horizontal scrolling.

---

## 9. Frontend Architecture Recommendations
- **Component Isolation**: Strict separation of generic UI elements (`src/components/common`) from feature-specific components (`src/pages/patient/components`).
- **CSS Strategy**: Use Tailwind utility classes. Avoid custom CSS files. Use `clsx` and `tailwind-merge` for predictable component prop overrides.
- **State Management**: Local component state for UI toggles (modals, dropdowns). Zustand for global authentication state. Axios interceptors for centralized API error handling.
