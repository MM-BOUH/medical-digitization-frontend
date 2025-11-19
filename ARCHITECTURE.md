# System Architecture & Workflow

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User's Browser                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  React Application                     │  │
│  │                                                         │  │
│  │  ┌──────────────────────────────────────────────┐     │  │
│  │  │            DigitizePage (Main)               │     │  │
│  │  │  ┌────────────────────────────────────┐      │     │  │
│  │  │  │  FileUploader Component            │      │     │  │
│  │  │  └────────────────────────────────────┘      │     │  │
│  │  │  ┌────────────────────────────────────┐      │     │  │
│  │  │  │  StatusIndicator Component         │      │     │  │
│  │  │  └────────────────────────────────────┘      │     │  │
│  │  │  ┌────────────────────────────────────┐      │     │  │
│  │  │  │  ExtractionModal Component         │      │     │  │
│  │  │  │  ├─ Image Preview (Left)           │      │     │  │
│  │  │  │  └─ Form Editor (Right)            │      │     │  │
│  │  │  │     └─ EditableField Components    │      │     │  │
│  │  │  └────────────────────────────────────┘      │     │  │
│  │  └──────────────────────────────────────────────┘     │  │
│  │                                                         │  │
│  │  ┌──────────────────────────────────────────────┐     │  │
│  │  │         API Actions (medicalReports.js)      │     │  │
│  │  │  • digitizeReport()                          │     │  │
│  │  │  • saveExtractedData()                       │     │  │
│  │  └──────────────────────────────────────────────┘     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Requests (fetch API)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Django Backend Server                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              /smrd/digitize/ Endpoint                  │  │
│  │  ┌─────────────────────────────────────────────┐      │  │
│  │  │  1. classify_image() → Report Type          │      │  │
│  │  │  2. extract_medical_report_data() → JSON    │      │  │
│  │  └─────────────────────────────────────────────┘      │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         /smrd/save-extracted-data/ Endpoint            │  │
│  │  • Saves to Database                                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## User Workflow Diagram

```
┌──────────────────┐
│  User Opens App  │
└────────┬─────────┘
         │
         ▼
┌────────────────────────┐
│ Enter Patient ID &     │
│ Healthcare Worker ID   │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│  Upload Medical Report │
│  (Drag & Drop / Click) │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│  Status: "Analyzing    │
│     document..."       │
└────────┬───────────────┘
         │
         ▼
    ┌────────┐
    │Backend │ → classify_image()
    │  Call  │
    └───┬────┘
        │
        ▼
   ┌─────────┐
   │Is Valid?│
   └────┬────┘
        │
    ┌───┴───┐
    │       │
   No      Yes
    │       │
    ▼       ▼
┌─────┐  ┌──────────────────────┐
│Error│  │Status: "Classified   │
│Show │  │   as [Type]"         │
└─────┘  └────────┬─────────────┘
                  │
                  ▼
         ┌────────────────────┐
         │Status: "Extracting │
         │      data..."      │
         └────────┬───────────┘
                  │
                  ▼
            ┌────────┐
            │Backend │ → extract_medical_report_data()
            │  Call  │
            └───┬────┘
                │
                ▼
         ┌──────────────┐
         │Status:       │
         │"Extraction   │
         │ complete!"   │
         └──────┬───────┘
                │
                ▼
         ┌──────────────────┐
         │ ExtractionModal  │
         │     Opens        │
         │                  │
         │ ┌──────────────┐ │
         │ │ Image Preview│ │
         │ └──────────────┘ │
         │ ┌──────────────┐ │
         │ │Editable Form │ │
         │ └──────────────┘ │
         └────────┬─────────┘
                  │
                  ▼
         ┌────────────────┐
         │ User Reviews & │
         │ Edits Data     │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │ Click "Confirm │
         │    & Save"     │
         └────────┬───────┘
                  │
                  ▼
            ┌────────┐
            │Backend │ → saveExtractedData()
            │  Call  │
            └───┬────┘
                │
                ▼
         ┌──────────────┐
         │ Success!     │
         │ Modal Closes │
         │ Form Resets  │
         └──────────────┘
```

## Component Hierarchy

```
App
└── Router
    └── DigitizePage
        ├── Form Inputs
        │   ├── Patient ID Input
        │   └── Healthcare Worker ID Input
        │
        ├── FileUploader
        │   ├── Drag & Drop Zone
        │   ├── File Input (hidden)
        │   ├── Image Preview
        │   └── Upload Button
        │
        ├── StatusIndicator
        │   ├── Loading Spinner
        │   ├── Success Icon
        │   ├── Error Icon
        │   └── Status Message
        │
        ├── Action Buttons
        │   ├── Start Digitization
        │   ├── Try Another File
        │   └── Digitize Another Report
        │
        └── ExtractionModal (conditional)
            ├── Modal Backdrop
            ├── Modal Container
            │   ├── Header
            │   │   ├── Title
            │   │   └── Close Button
            │   │
            │   ├── Content (Split Layout)
            │   │   ├── Left Panel (Image)
            │   │   │   ├── Zoom Controls
            │   │   │   └── Zoomable Image
            │   │   │
            │   │   └── Right Panel (Form)
            │   │       ├── Metadata Section
            │   │       │   └── EditableField (x6)
            │   │       │
            │   │       ├── Results Sections
            │   │       │   └── Result Section
            │   │       │       ├── Section Title
            │   │       │       ├── EditableField (xN)
            │   │       │       ├── Add Field Button
            │   │       │       └── Delete Section Button
            │   │       │
            │   │       └── Add Section Button
            │   │
            │   └── Footer
            │       ├── Cancel Button
            │       └── Confirm & Save Button
            │
            └── (invisible when closed)
```

## Data Flow

```
1. User Input
   ┌──────────────────┐
   │ Patient ID: 123  │
   │ Worker ID: 456   │
   │ File: report.jpg │
   └────────┬─────────┘
            │
            ▼
2. FormData Creation
   ┌────────────────────┐
   │ FormData Object    │
   │ • image: File      │
   │ • patient_id: 123  │
   │ • healthcare_w...  │
   └────────┬───────────┘
            │
            ▼
3. POST /smrd/digitize/
   ┌────────────────────────┐
   │ Backend Processing:    │
   │ 1. Classify → Type     │
   │ 2. Extract → JSON      │
   └────────┬───────────────┘
            │
            ▼
4. Response
   ┌────────────────────────┐
   │ {                      │
   │   report_type: "...",  │
   │   extracted_data: {    │
   │     metadata: {...},   │
   │     results: [...]     │
   │   }                    │
   │ }                      │
   └────────┬───────────────┘
            │
            ▼
5. State Update
   ┌────────────────────────┐
   │ React State:           │
   │ • extractedData        │
   │ • reportType           │
   │ • status: 'success'    │
   └────────┬───────────────┘
            │
            ▼
6. Modal Display
   ┌────────────────────────┐
   │ ExtractionModal        │
   │ • Shows data           │
   │ • Allows editing       │
   └────────┬───────────────┘
            │
            ▼
7. User Edits (Optional)
   ┌────────────────────────┐
   │ Modified Data:         │
   │ • Updated metadata     │
   │ • Updated results      │
   │ • Added/removed fields │
   └────────┬───────────────┘
            │
            ▼
8. Confirm & Save
   ┌────────────────────────┐
   │ POST /smrd/save-ex...  │
   │ {                      │
   │   metadata: {...},     │
   │   results: [...],      │
   │   report_type: "...",  │
   │   patient_id: 123,     │
   │   healthcare_w...      │
   │ }                      │
   └────────┬───────────────┘
            │
            ▼
9. Success Response
   ┌────────────────────────┐
   │ { success: true }      │
   └────────┬───────────────┘
            │
            ▼
10. Reset Form
    ┌────────────────────┐
    │ • Close modal      │
    │ • Clear fields     │
    │ • Ready for next   │
    └────────────────────┘
```

## State Management

```
DigitizePage State
├── selectedFile: File | null
├── isUploading: boolean
├── status: 'idle' | 'analyzing' | 'classified' | 'extracting' | 'success' | 'error' | 'not-medical'
├── statusMessage: string
├── reportType: string
├── extractedData: Object | null
├── showModal: boolean
├── patientId: string
└── healthcareWorkerId: string

ExtractionModal State
├── metadata: Object
├── results: Array<Object>
├── imageUrl: string | null
├── imageZoom: number
└── isSaving: boolean

FileUploader State
├── isDragging: boolean
└── previewUrl: string | null

StatusIndicator Props (no state)
├── status: string
├── message: string
└── reportType: string

EditableField State
├── isEditingLabel: boolean
└── isEditingValue: boolean
```

## API Call Sequence

```
Timeline:

T=0s    User clicks "Start Digitization"
        ↓
T=0.1s  setIsUploading(true)
        setStatus('analyzing')
        ↓
T=0.2s  digitizeReport(file, patientId, workerId)
        → POST /smrd/digitize/
        ↓
        [Backend Processing: 2-5 seconds]
        ├─ classify_image(): 1-2s
        └─ extract_medical_report_data(): 1-3s
        ↓
T=3s    Response received
        ├─ If error: setStatus('error' or 'not-medical')
        └─ If success:
           ├─ setReportType(response.report_type)
           ├─ setStatus('classified')
           ├─ Wait 1s
           ├─ setStatus('extracting')
           ├─ setExtractedData(response.extracted_data)
           ├─ setStatus('success')
           ├─ Wait 0.5s
           └─ setShowModal(true)
        ↓
T=5s    Modal opens
        User reviews & edits data
        ↓
T=30s   User clicks "Confirm & Save"
        ↓
T=30.1s setIsSaving(true)
        saveExtractedData(confirmedData)
        → POST /smrd/save-extracted-data/
        ↓
        [Backend Processing: 0.5-1s]
        ↓
T=31s   Response received
        ├─ If success:
        │  ├─ setShowModal(false)
        │  ├─ Reset all state
        │  └─ Show success alert
        └─ If error:
           └─ Show error in modal
```

## Responsive Layout Breakpoints

```
Mobile Portrait (320px - 639px)
┌─────────────────────────┐
│       Header            │
├─────────────────────────┤
│  Patient ID [_______]   │
│  Worker ID  [_______]   │
├─────────────────────────┤
│                         │
│   FileUploader          │
│   (Full Width)          │
│                         │
├─────────────────────────┤
│   StatusIndicator       │
│   (Centered)            │
├─────────────────────────┤
│   [Start Digitization]  │
│   (Full Width Button)   │
└─────────────────────────┘

Tablet Portrait (768px - 1023px)
┌──────────────────────────────────┐
│            Header                │
├──────────────────┬───────────────┤
│ Patient ID [___] │ Worker ID [_] │
├──────────────────┴───────────────┤
│                                  │
│       FileUploader               │
│       (Constrained)              │
│                                  │
├──────────────────────────────────┤
│      StatusIndicator             │
│         (Centered)               │
├──────────────────────────────────┤
│      [Start Digitization]        │
│       (Auto Width)               │
└──────────────────────────────────┘

Desktop (1024px+)
┌─────────────────────────────────────────┐
│               Header                    │
├───────────────────┬─────────────────────┤
│ Patient ID [____] │ Worker ID [_______] │
├───────────────────┴─────────────────────┤
│                                         │
│          FileUploader                   │
│       (Max Width 2xl)                   │
│          Centered                       │
│                                         │
├─────────────────────────────────────────┤
│        StatusIndicator                  │
│           (Centered)                    │
├─────────────────────────────────────────┤
│      [Start] [Try Another]              │
│      (Auto Width Buttons)               │
└─────────────────────────────────────────┘

ExtractionModal - Mobile
┌──────────────────────┐
│  [X]                 │
├──────────────────────┤
│      Image           │
│   (Fixed 40vh)       │
├──────────────────────┤
│                      │
│    Scrollable        │
│      Form            │
│                      │
│                      │
│                      │
└──────────────────────┘

ExtractionModal - Desktop
┌────────────────────────────────────┐
│  Review Data            [X]        │
├─────────────┬──────────────────────┤
│             │                      │
│   Image     │   Scrollable Form    │
│  (Fixed,    │    (Metadata +       │
│   Zoom)     │     Results)         │
│             │                      │
│   40%       │       60%            │
│             │                      │
├─────────────┴──────────────────────┤
│         [Cancel] [Confirm]         │
└────────────────────────────────────┘
```

## Technology Stack Diagram

```
┌─────────────────────────────────────────┐
│           Browser Layer                  │
│  • Chrome, Firefox, Safari, Edge        │
│  • Mobile Browsers                       │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│        React Application (v18)           │
│  ┌──────────────────────────────────┐   │
│  │        Components (JSX)           │   │
│  │  • Functional Components          │   │
│  │  • React Hooks (useState, etc.)   │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │       React Router (v6)           │   │
│  │  • Client-side routing            │   │
│  └──────────────────────────────────┘   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│       Styling Layer                      │
│  ┌──────────────────────────────────┐   │
│  │      Tailwind CSS (v3)            │   │
│  │  • Utility-first classes          │   │
│  │  • Responsive utilities           │   │
│  │  • Custom theme                   │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │         PostCSS                   │   │
│  │  • Autoprefixer                   │   │
│  │  • CSS optimization               │   │
│  └──────────────────────────────────┘   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│       Build & Dev Tools                  │
│  ┌──────────────────────────────────┐   │
│  │          Vite (v5)                │   │
│  │  • Development server             │   │
│  │  • Hot Module Replacement         │   │
│  │  • Production bundling            │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │        Polyfills                  │   │
│  │  • core-js (ES6+ features)        │   │
│  │  • regenerator-runtime (async)    │   │
│  └──────────────────────────────────┘   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Backend Integration              │
│  ┌──────────────────────────────────┐   │
│  │      Fetch API                    │   │
│  │  • HTTP requests to Django        │   │
│  │  • FormData for file upload       │   │
│  │  • JSON for data exchange         │   │
│  └──────────────────────────────────┘   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│       Django Backend                     │
│  • /smrd/digitize/                       │
│  • /smrd/save-extracted-data/            │
└─────────────────────────────────────────┘
```

---

This architecture ensures:
✅ Clean separation of concerns
✅ Reusable components
✅ Scalable structure
✅ Easy maintenance
✅ Clear data flow
✅ Responsive design at every level
