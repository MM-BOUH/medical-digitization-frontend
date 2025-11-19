# Complete File Index

This document provides a comprehensive overview of all files in the Medical Report Digitization System frontend.

## 📁 Project Structure

```
medical-digitization-frontend/
├── 📄 Configuration Files
├── 📝 Documentation Files
├── 🎨 Styling Files
├── ⚛️ React Components
└── 🔧 Build & Tools
```

---

## 📄 Configuration Files

### `.browserslistrc`
**Purpose:** Defines target browsers for compatibility
**Contains:**
- Production browser targets (>0.2%, not dead)
- Development browser targets (latest Chrome, Firefox, Safari, Edge)
**Used by:** Autoprefixer, Babel transpilation

### `package.json`
**Purpose:** Project metadata and dependencies
**Contains:**
- Project name and version
- NPM scripts (dev, build, preview, lint)
- Dependencies (React, React Router)
- DevDependencies (Vite, Tailwind, PostCSS, Autoprefixer)
- Browserslist configuration
**Key Scripts:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

### `vite.config.js`
**Purpose:** Vite build tool configuration
**Contains:**
- React plugin setup
- Build target (ES2015)
- Development server configuration
- Proxy setup for backend API
**Key Settings:**
- Port: 3000
- Proxy: `/smrd` → `http://localhost:8000`

### `tailwind.config.js`
**Purpose:** Tailwind CSS framework configuration
**Contains:**
- Content paths for purging unused CSS
- Custom theme extensions
- Healthcare-friendly color palette
- Font family customization
**Custom Colors:**
- Primary blue shades (50-900)
- Custom shadow utilities

### `postcss.config.js`
**Purpose:** PostCSS processing configuration
**Contains:**
- Tailwind CSS plugin
- Autoprefixer plugin
**Handles:** Vendor prefixing, CSS transformations

### `.eslintrc.cjs`
**Purpose:** ESLint code quality configuration
**Contains:**
- Environment setup (browser, ES2021, node)
- React plugin configuration
- Linting rules
**Key Rules:**
- Prop-types disabled (using JSDoc)
- Unused vars warnings
- React-in-JSX-scope off (React 17+)

### `.gitignore`
**Purpose:** Git version control ignore patterns
**Ignores:**
- node_modules/
- dist/ and build/
- .env files
- Editor-specific files
- Logs and temporary files

---

## 📝 Documentation Files

### `README.md` (Main Documentation)
**Lines:** ~500+
**Sections:**
1. Features overview
2. Tech stack
3. Project structure
4. Installation guide
5. Usage instructions
6. Development guidelines
7. Backend integration specs
8. Responsive breakpoints
9. Browser compatibility summary
10. Performance optimization
11. Accessibility features
12. Deployment guide
13. Troubleshooting
14. Changelog

### `BROWSER_COMPATIBILITY.md`
**Lines:** ~600+
**Sections:**
1. Supported browsers matrix
2. Browser-specific implementations
   - Safari (macOS & iOS)
   - Firefox
   - Chrome
   - Edge
   - Mobile browsers
3. CSS feature detection
4. JavaScript polyfills
5. Vendor prefixes
6. Testing strategy
7. Common issues & solutions
8. Resources and tools

### `QUICKSTART.md`
**Lines:** ~300+
**Sections:**
1. Prerequisites checklist
2. 5-minute installation guide
3. Testing the application
4. Common issues and fixes
5. Development tips
6. Project structure overview
7. Useful commands
8. Next steps

### `PROJECT_SUMMARY.md`
**Lines:** ~400+
**Sections:**
1. Project deliverables
2. Features implemented (checkboxes)
3. Design implementation
4. Backend integration specs
5. Getting started
6. Responsive behavior
7. Browser-specific features
8. Testing recommendations
9. Key technical achievements
10. Deployment options
11. Project status

### `ARCHITECTURE.md`
**Lines:** ~700+
**Contains:**
1. Application architecture diagram
2. User workflow diagram
3. Component hierarchy tree
4. Data flow sequence
5. State management structure
6. API call sequence timeline
7. Responsive layout breakpoints
8. Technology stack diagram

---

## 🎨 Styling Files

### `src/index.css`
**Lines:** ~150
**Purpose:** Global styles and Tailwind imports
**Contains:**
1. Tailwind directives (@tailwind base, components, utilities)
2. Base styles (* reset)
3. iOS Safari viewport fixes
4. Cross-browser scrollbar styling
5. Autofill styles removal (Chrome)
6. Smooth transitions
7. Focus-visible styles
8. Loading animations
9. Backdrop blur fallbacks
10. Touch target sizing for mobile
11. Print styles

**Key Features:**
- Cross-browser compatibility
- Safari-specific fixes
- Accessibility focus indicators
- Responsive touch targets

### `index.html`
**Lines:** ~70
**Purpose:** HTML template and app entry point
**Contains:**
1. Meta tags (viewport, theme-color, description)
2. iOS-specific meta tags
3. Open Graph / Twitter meta tags
4. Google Fonts (Inter)
5. Loading screen
6. Root div (#root)
7. Module script import
8. iOS viewport height fix script
9. Noscript fallback

**Key Features:**
- SEO-friendly meta tags
- Social media preview tags
- Progressive enhancement
- Loading state handling

---

## ⚛️ React Components

### Core Application Files

#### `src/App.jsx`
**Lines:** ~20
**Purpose:** Root application component
**Contains:**
- React Router setup
- Route definitions
**Routes:**
- `/` → DigitizePage
- `/digitize` → DigitizePage

#### `src/main.jsx`
**Lines:** ~25
**Purpose:** Application entry point
**Contains:**
- Polyfill imports (core-js, regenerator-runtime)
- Feature detection checks
- React root rendering
- StrictMode wrapper

**Polyfills:**
- ES6+ features (Promise, fetch, Array/Object methods)
- async/await support

---

### Page Components

#### `src/pages/DigitizePage.jsx`
**Lines:** ~350
**Purpose:** Main digitization workflow page
**State Management:**
- selectedFile: File | null
- isUploading: boolean
- status: string (idle, analyzing, classified, extracting, success, error, not-medical)
- statusMessage: string
- reportType: string
- extractedData: Object | null
- showModal: boolean
- patientId: string
- healthcareWorkerId: string

**Key Functions:**
- handleFileSelect(): Processes file selection
- handleSubmit(): Starts digitization workflow
- handleConfirmData(): Saves confirmed data to backend
- handleModalClose(): Closes extraction modal
- handleReset(): Resets form state

**Workflow:**
1. User enters IDs
2. User uploads file
3. Backend classifies report
4. Backend extracts data
5. Modal opens for review
6. User edits and confirms
7. Data saved to backend
8. Form resets for next report

**UI Sections:**
- Header with title
- Form inputs (Patient ID, Healthcare Worker ID)
- File uploader
- Status indicator
- Action buttons
- Instructions card
- Extraction modal

---

### UI Components

#### `src/components/FileUploader.jsx`
**Lines:** ~200
**Purpose:** File upload with drag-and-drop
**Props:**
- onFileSelect: (file) => void
- isUploading: boolean
- disabled: boolean

**State:**
- isDragging: boolean
- previewUrl: string | null

**Features:**
- Drag and drop support
- Click to browse fallback
- Image preview
- File validation (type, size)
- Touch-optimized
- Cross-browser compatible

**Accepted Formats:**
- JPG, JPEG, PNG, PDF
- Max size: 10MB

**Event Handlers:**
- handleDragEnter/Leave/Over
- handleDrop
- handleClick
- handleInputChange
- handleClear

#### `src/components/StatusIndicator.jsx`
**Lines:** ~150
**Purpose:** Animated status display
**Props:**
- status: string (analyzing, classified, extracting, success, error, not-medical)
- message: string
- reportType: string

**Visual States:**
- Analyzing/Extracting: Spinning loader (blue)
- Success: Checkmark icon (green)
- Error/Not Medical: X icon (red)
- Classified: Document check icon (blue)

**Features:**
- CSS-based animations
- Responsive icon sizing
- Color-coded states
- Smooth transitions
- Cross-browser support

#### `src/components/ExtractionModal.jsx`
**Lines:** ~450
**Purpose:** Split-screen data review modal
**Props:**
- isOpen: boolean
- onClose: () => void
- extractedData: Object
- imageFile: File
- reportType: string
- onConfirm: (data) => void

**State:**
- metadata: Object
- results: Array<Object>
- imageUrl: string | null
- imageZoom: number (0.5 - 3.0)
- isSaving: boolean

**Layout:**
- **Left Panel (40%):** Image preview with zoom controls
- **Right Panel (60%):** Scrollable form with editable fields

**Key Functions:**
- handleMetadataChange()
- handleResultChange()
- handleAddField()
- handleDeleteField()
- handleAddResultSection()
- handleDeleteResultSection()
- handleZoomIn/Out/Reset()
- handleConfirm()

**Features:**
- Split-screen layout (desktop)
- Stacked layout (mobile)
- Image zoom/pan
- Inline editing
- Add/remove fields
- Section management
- Body scroll lock
- Keyboard support (Escape to close)

**Responsive Behavior:**
- Mobile: Full-screen, image above form
- Tablet: 50/50 split or tabs
- Desktop: 40/60 split, fixed image

#### `src/components/EditableField.jsx`
**Lines:** ~100
**Purpose:** Inline editable form field
**Props:**
- label: string
- value: string
- onLabelChange: (value) => void
- onValueChange: (value) => void
- onDelete: () => void
- isMetadata: boolean

**State:**
- isEditingLabel: boolean
- isEditingValue: boolean

**Features:**
- Click to edit
- Keyboard support (Enter to save, Tab to navigate)
- Delete button (non-metadata fields)
- Responsive layout
- Hover effects

**Layout:**
- Label (1/3 width on desktop)
- Value (2/3 width on desktop)
- Delete button (appears on hover)

---

### API Actions

#### `src/actions/medicalReports.js`
**Lines:** ~100
**Purpose:** Backend API integration
**Base URL:** `http://localhost:8000` (configurable)

**Functions:**

##### `digitizeReport(imageFile, patientId, healthcareWorkerId)`
- **Method:** POST
- **Endpoint:** `/smrd/digitize/`
- **Request:** FormData (image, patient_id, healthcare_worker_id)
- **Returns:** Promise<Object>
  - Success: { report_type, extracted_data }
  - Error: { error: string }

##### `saveExtractedData(reportData)`
- **Method:** POST
- **Endpoint:** `/smrd/save-extracted-data/`
- **Request:** JSON (metadata, results, report_type, patient_id, healthcare_worker_id)
- **Returns:** Promise<Object>
  - Success: { success: true, message, report_id }
  - Error: { error: string }

##### `fetchPatients()` (Optional)
- **Method:** GET
- **Endpoint:** `/api/patients/`
- **Returns:** Promise<Array>

##### `fetchHealthcareWorkers()` (Optional)
- **Method:** GET
- **Endpoint:** `/api/operators/`
- **Returns:** Promise<Array>

**Error Handling:**
- Try-catch wrapping
- Console error logging
- Error propagation to caller

---

## 📊 File Statistics

### Total Files: 21

**By Type:**
- JavaScript/JSX: 9 files
- Configuration: 6 files
- Documentation: 5 files
- Styling: 2 files
- HTML: 1 file

**By Category:**
- React Components: 5 files (FileUploader, StatusIndicator, ExtractionModal, EditableField, DigitizePage)
- Core App: 2 files (App.jsx, main.jsx)
- API Integration: 1 file (medicalReports.js)
- Documentation: 5 files (README, QUICKSTART, BROWSER_COMPATIBILITY, PROJECT_SUMMARY, ARCHITECTURE)
- Configuration: 6 files (package.json, vite.config, tailwind.config, etc.)
- Styling: 2 files (index.css, index.html)

### Lines of Code (Approximate)

**React Components:** ~1,300 lines
- DigitizePage.jsx: 350
- ExtractionModal.jsx: 450
- FileUploader.jsx: 200
- StatusIndicator.jsx: 150
- EditableField.jsx: 100
- App.jsx: 20
- main.jsx: 25

**API Actions:** ~100 lines
- medicalReports.js: 100

**Styling:** ~220 lines
- index.css: 150
- index.html: 70

**Configuration:** ~200 lines
- All config files combined

**Documentation:** ~2,500 lines
- README.md: 500+
- BROWSER_COMPATIBILITY.md: 600+
- QUICKSTART.md: 300+
- PROJECT_SUMMARY.md: 400+
- ARCHITECTURE.md: 700+

**Total Lines:** ~4,320

---

## 🎯 Key Features by File

### Responsiveness
- **Primary:** DigitizePage.jsx, ExtractionModal.jsx, FileUploader.jsx
- **Supporting:** index.css, tailwind.config.js

### Cross-Browser Compatibility
- **Primary:** index.css, .browserslistrc, postcss.config.js
- **Documentation:** BROWSER_COMPATIBILITY.md

### Accessibility
- **Primary:** All component files (ARIA labels, keyboard nav)
- **Supporting:** index.css (focus indicators, touch targets)

### Backend Integration
- **Primary:** medicalReports.js
- **Using:** DigitizePage.jsx

### State Management
- **Primary:** DigitizePage.jsx (main workflow state)
- **Secondary:** ExtractionModal.jsx, FileUploader.jsx, EditableField.jsx

---

## 🔧 Build & Development Files

### Development
- **Entry:** `src/main.jsx`
- **Dev Server:** Vite (`npm run dev`)
- **Hot Reload:** Automatic via Vite HMR
- **Port:** 3000

### Production
- **Build Command:** `npm run build`
- **Output:** `dist/` directory
- **Optimization:** Tree-shaking, minification, code splitting
- **Preview:** `npm run preview`

### Code Quality
- **Linting:** ESLint (`.eslintrc.cjs`)
- **Command:** `npm run lint`
- **Rules:** React-specific, ES2021

---

## 📦 Dependencies Overview

### Runtime Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0"
}
```

### Development Dependencies
```json
{
  "@vitejs/plugin-react": "^4.2.0",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32",
  "tailwindcss": "^3.3.6",
  "vite": "^5.0.7",
  "core-js": "^3.34.0",
  "regenerator-runtime": "^0.14.0"
}
```

---

## 🚀 Quick Reference

### Essential Commands
```bash
npm install              # Install dependencies
npm run dev             # Start development
npm run build           # Build production
npm run preview         # Preview build
npm run lint            # Check code
```

### Key Files to Modify
- **Backend URL:** `src/actions/medicalReports.js`
- **Colors:** `tailwind.config.js`
- **Ports:** `vite.config.js`
- **Global Styles:** `src/index.css`

### Key Files to Read First
1. `README.md` - Complete overview
2. `QUICKSTART.md` - Get started fast
3. `PROJECT_SUMMARY.md` - What's included
4. `src/pages/DigitizePage.jsx` - Main workflow
5. `src/components/ExtractionModal.jsx` - Data review

---

**Last Updated:** November 12, 2024
**Maintainer:** Mohamed - Kyushu University
**Status:** Production-Ready ✅
