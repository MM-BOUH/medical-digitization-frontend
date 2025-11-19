# Visual UI Guide

This document provides ASCII representations of the UI components and layouts.

---

## Main Page Layout (Desktop)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                    MEDICAL REPORT DIGITIZATION                            ║
║        Upload scanned medical reports for automatic classification        ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   ┌──────────────────────────────┐  ┌──────────────────────────────────┐ ║
║   │ Patient ID *                 │  │ Healthcare Worker ID *           │ ║
║   │ [_________________________]  │  │ [_________________________]      │ ║
║   └──────────────────────────────┘  └──────────────────────────────────┘ ║
║                                                                           ║
║   ┌─────────────────────────────────────────────────────────────────┐   ║
║   │                                                                   │   ║
║   │                        ╔═══════════╗                             │   ║
║   │                        ║           ║                             │   ║
║   │                        ║  Upload   ║                             │   ║
║   │                        ║   Icon    ║                             │   ║
║   │                        ║           ║                             │   ║
║   │                        ╚═══════════╝                             │   ║
║   │                                                                   │   ║
║   │                    Upload Medical Report                         │   ║
║   │        Drag and drop your file here, or click to browse         │   ║
║   │              Supported formats: JPG, PNG, PDF (max 10MB)        │   ║
║   │                                                                   │   ║
║   └─────────────────────────────────────────────────────────────────┘   ║
║                                                                           ║
║                     [    Start Digitization    ]                         ║
║                                                                           ║
║   ┌─────────────────────────────────────────────────────────────────┐   ║
║   │                       How It Works                               │   ║
║   │                                                                   │   ║
║   │  ① Enter the Patient ID and Healthcare Worker ID                │   ║
║   │  ② Upload a clear scan or photo of the medical report           │   ║
║   │  ③ The system will automatically classify the report type       │   ║
║   │  ④ Review and edit the extracted data before saving             │   ║
║   │  ⑤ Confirm and save the digitized report to the database        │   ║
║   └─────────────────────────────────────────────────────────────────┘   ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## Status Indicator States

### Analyzing
```
┌──────────────────────────┐
│                          │
│        ⟳ (spinning)      │
│                          │
│   Analyzing document...  │
│                          │
└──────────────────────────┘
```

### Classified
```
┌──────────────────────────┐
│                          │
│        ✓ (checkmark)     │
│                          │
│  Classified as Hematology│
│                          │
└──────────────────────────┘
```

### Extracting
```
┌──────────────────────────┐
│                          │
│        ⟳ (spinning)      │
│                          │
│    Extracting data...    │
│                          │
└──────────────────────────┘
```

### Success
```
┌──────────────────────────┐
│                          │
│        ✓ (green check)   │
│                          │
│   Extraction complete!   │
│                          │
└──────────────────────────┘
```

### Error
```
┌──────────────────────────┐
│                          │
│        ✗ (red X)         │
│                          │
│  Not a medical report    │
│                          │
└──────────────────────────┘
```

---

## Extraction Modal (Desktop)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  Review Extracted Data                                          [✗ Close] ║
║  Report Type: Hematology                                                  ║
╠════════════════════════════╦══════════════════════════════════════════════╣
║                            ║                                              ║
║  ┌──────────────────────┐ ║  ┌─────────────────────────────────────────┐║
║  │ [−] 75% [+] [Reset]  │ ║  │ PATIENT INFORMATION                     │║
║  └──────────────────────┘ ║  ├─────────────────────────────────────────┤║
║                            ║  │ Patient Name    John Doe                │║
║  ┌──────────────────────┐ ║  │ Age             45                       │║
║  │                      │ ║  │ Gender          Male                     │║
║  │                      │ ║  │ Lab Name        Central Lab              │║
║  │    Medical Report    │ ║  │ Doctor Name     Dr. Smith                │║
║  │       Image          │ ║  │ Report Date     2024-11-10               │║
║  │                      │ ║  └─────────────────────────────────────────┘║
║  │    (Zoomable &       │ ║                                              ║
║  │     Pannable)        │ ║  ┌─────────────────────────────────────────┐║
║  │                      │ ║  │ Complete Blood Count         [Delete] ✗ │║
║  │                      │ ║  ├─────────────────────────────────────────┤║
║  └──────────────────────┘ ║  │ Test Name   │ Hemoglobin                │║
║                            ║  │ Value       │ 14.5                      │║
║         Image Panel        ║  │ Unit        │ g/dL                      │║
║           (40%)            ║  │ Ref Range   │ 13.5-17.5                 │║
║                            ║  ├─────────────────────────────────────────┤║
║                            ║  │ Test Name   │ WBC Count                 │║
║                            ║  │ Value       │ 7500                      │║
║                            ║  │ Unit        │ /μL                       │║
║                            ║  │ Ref Range   │ 4000-11000                │║
║                            ║  ├─────────────────────────────────────────┤║
║                            ║  │         [+ Add Field]                   │║
║                            ║  └─────────────────────────────────────────┘║
║                            ║                                              ║
║                            ║  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐║
║                            ║    [+ Add New Section]                       ║
║                            ║  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘║
║                            ║                                              ║
║                            ║        Form Panel (60%, Scrollable)         ║
║                            ║                                              ║
╠════════════════════════════╩══════════════════════════════════════════════╣
║                   [  Cancel  ]    [ Confirm & Save ]                     ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## Extraction Modal (Mobile)

```
┌─────────────────────────────────┐
│ Review Data              [✗]    │
│ Report Type: Hematology         │
├─────────────────────────────────┤
│ ┌────────────────────────────┐  │
│ │ [−] 100% [+] [Reset]       │  │
│ ├────────────────────────────┤  │
│ │                            │  │
│ │     Medical Report         │  │
│ │         Image              │  │
│ │      (Swipeable)           │  │
│ │                            │  │
│ └────────────────────────────┘  │
│     (Fixed Height: 40vh)        │
├─────────────────────────────────┤
│                                 │
│ ┌────────────────────────────┐  │
│ │ PATIENT INFORMATION        │  │
│ ├────────────────────────────┤  │
│ │ Patient Name: John Doe     │  │
│ │ Age: 45                    │  │
│ │ Gender: Male               │  │
│ │ Lab Name: Central Lab      │  │
│ │ Doctor: Dr. Smith          │  │
│ │ Date: 2024-11-10           │  │
│ └────────────────────────────┘  │
│                                 │
│ ┌────────────────────────────┐  │
│ │ Complete Blood Count   [✗] │  │
│ ├────────────────────────────┤  │
│ │ Test: Hemoglobin           │  │
│ │ Value: 14.5                │  │
│ │ Unit: g/dL                 │  │
│ │ Range: 13.5-17.5           │  │
│ ├────────────────────────────┤  │
│ │ Test: WBC Count            │  │
│ │ Value: 7500                │  │
│ │ Unit: /μL                  │  │
│ │ Range: 4000-11000          │  │
│ ├────────────────────────────┤  │
│ │    [+ Add Field]           │  │
│ └────────────────────────────┘  │
│                                 │
│ [+ Add New Section]             │
│                                 │
│    (Scrollable Form Area)       │
│                                 │
├─────────────────────────────────┤
│ [      Cancel      ]            │
│ [  Confirm & Save  ]            │
└─────────────────────────────────┘
```

---

## File Upload States

### Empty State
```
┌─────────────────────────────────────┐
│                                     │
│           ╔═══════════╗             │
│           ║           ║             │
│           ║  Upload   ║             │
│           ║   Icon    ║             │
│           ║           ║             │
│           ╚═══════════╝             │
│                                     │
│      Upload Medical Report          │
│  Drag and drop your file here,     │
│      or click to browse             │
│                                     │
│   Supported formats: JPG, PNG, PDF │
│            (max 10MB)               │
│                                     │
└─────────────────────────────────────┘
```

### Dragging Over
```
┌─────────────────────────────────────┐
│ ╔═══════════════════════════════╗   │
│ ║                               ║   │
│ ║       ╔═══════════╗           ║   │
│ ║       ║           ║           ║   │
│ ║       ║  Upload   ║           ║   │
│ ║       ║   Icon    ║           ║   │
│ ║       ║           ║           ║   │
│ ║       ╚═══════════╝           ║   │
│ ║                               ║   │
│ ║    Drop file to upload        ║   │
│ ║                               ║   │
│ ╚═══════════════════════════════╝   │
└─────────────────────────────────────┘
     (Highlighted blue background)
```

### With Image Preview
```
┌─────────────────────────────────────┐
│  ┌───────────────────────────────┐  │
│  │                          [✗]  │  │
│  │                               │  │
│  │      ┌──────────────┐         │  │
│  │      │              │         │  │
│  │      │   Medical    │         │  │
│  │      │   Report     │         │  │
│  │      │   Preview    │         │  │
│  │      │              │         │  │
│  │      └──────────────┘         │  │
│  │                               │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
    (Preview with remove button)
```

### Uploading
```
┌─────────────────────────────────────┐
│                                     │
│           ╔═══════════╗             │
│           ║    ⟳      ║             │
│           ║ (spinning)║             │
│           ╚═══════════╝             │
│                                     │
│          Uploading...               │
│                                     │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░  65%        │
│                                     │
└─────────────────────────────────────┘
    (Progress bar with percentage)
```

---

## Editable Field Component

### View Mode
```
┌──────────────────────────────────────────┐
│ Test Name            Hemoglobin          │
│ (hover to see edit cursor)               │
└──────────────────────────────────────────┘
```

### Edit Mode - Label
```
┌──────────────────────────────────────────┐
│ [Test Name_________]   Hemoglobin        │
│ (typing with blue border)                │
└──────────────────────────────────────────┘
```

### Edit Mode - Value
```
┌──────────────────────────────────────────┐
│ Test Name            [14.5_______]  [✗]  │
│ (typing with blue border + delete btn)   │
└──────────────────────────────────────────┘
```

### Hover State (Non-metadata field)
```
┌──────────────────────────────────────────┐
│ Test Name            Hemoglobin      [✗] │
│ (gray background, delete button visible) │
└──────────────────────────────────────────┘
```

---

## Buttons

### Primary Button (Start Digitization)
```
┌────────────────────────────────┐
│                                │
│     Start Digitization         │
│   (Blue background, white text)│
│                                │
└────────────────────────────────┘
```

### Secondary Button (Cancel)
```
┌────────────────────────────────┐
│                                │
│           Cancel               │
│  (White background, gray text, │
│        gray border)            │
│                                │
└────────────────────────────────┘
```

### Success Button (Confirm & Save)
```
┌────────────────────────────────┐
│                                │
│      Confirm & Save            │
│  (Blue background, white text, │
│        with shadow)            │
│                                │
└────────────────────────────────┘
```

### Disabled Button
```
┌────────────────────────────────┐
│                                │
│     Start Digitization         │
│  (Gray background, disabled,   │
│      no cursor pointer)        │
│                                │
└────────────────────────────────┘
```

### Icon Button (Add Field)
```
┌────────────────────────────────┐
│   [+]  Add Field               │
│  (Light blue background)       │
└────────────────────────────────┘
```

---

## Responsive Layout Transitions

### Desktop (≥1024px)
```
┌─────────────────────────────────────────────┐
│  Patient ID [______]  │  Worker ID [_____]  │
└─────────────────────────────────────────────┘
           (Two columns, side by side)
```

### Tablet (768px - 1023px)
```
┌─────────────────────────────────────────────┐
│  Patient ID [______]  │  Worker ID [_____]  │
└─────────────────────────────────────────────┘
           (Two columns, narrower)
```

### Mobile (< 768px)
```
┌────────────────────────┐
│  Patient ID            │
│  [___________________] │
│                        │
│  Worker ID             │
│  [___________________] │
└────────────────────────┘
  (Single column, stacked)
```

---

## Color Palette Visual

```
Primary Colors:
┌────────┬────────┬────────┬────────┬────────┐
│ blue-50│blue-100│blue-300│blue-500│blue-600│
│ #EFF6FF│#DBEAFE│#93C5FD│#3B82F6│#2563EB│
└────────┴────────┴────────┴────────┴────────┘

Status Colors:
┌────────┬────────┬────────┐
│green-50│green-500│red-500│
│#F0FDF4 │#10B981 │#EF4444│
│Success │Success  │Error  │
└────────┴────────┴────────┘

Neutral Colors:
┌────────┬────────┬────────┬────────┐
│ white  │gray-50 │gray-200│gray-800│
│#FFFFFF │#F9FAFB │#E5E7EB │#1F2937│
│  Base  │ Panel  │ Border │  Text  │
└────────┴────────┴────────┴────────┘
```

---

## Typography Scale

```
Headings:
  H1: text-2xl md:text-3xl lg:text-4xl (32px - 36px desktop)
  H2: text-xl md:text-2xl             (24px - 32px desktop)
  H3: text-lg md:text-xl              (18px - 24px desktop)

Body Text:
  Base: text-sm md:text-base          (14px - 16px desktop)
  Small: text-xs md:text-sm           (12px - 14px desktop)

Buttons:
  text-sm md:text-base                (14px - 16px desktop)
```

---

## Spacing System

```
Padding Scale (Example: Upload Area):
Mobile:    p-6     (1.5rem / 24px)
Small:     sm:p-8  (2rem / 32px)
Medium:    md:p-10 (2.5rem / 40px)
Large:     lg:p-12 (3rem / 48px)

Gap Scale (Example: Form Sections):
Mobile:    gap-3       (0.75rem / 12px)
Medium:    md:gap-4    (1rem / 16px)
Large:     lg:gap-6    (1.5rem / 24px)
```

---

## Shadow Hierarchy

```
Small Shadow (Cards):
  shadow-sm: 0 1px 2px rgba(0,0,0,0.05)

Medium Shadow (Modals):
  shadow-md: 0 4px 6px rgba(0,0,0,0.1)

Large Shadow (Buttons):
  shadow-lg: 0 10px 15px rgba(0,0,0,0.1)

Extra Large (Modal Backdrop):
  shadow-2xl: 0 25px 50px rgba(0,0,0,0.25)
```

---

## Interaction States

### Button Hover
```
Before:  bg-blue-500
Hover:   bg-blue-600
    (Slightly darker on hover)
```

### Input Focus
```
Before:  border-gray-300
Focus:   border-blue-500 + ring-2 ring-blue-500
    (Blue border and focus ring)
```

### Drag Over
```
Before:  border-gray-300
Drag:    border-blue-500 + bg-blue-50
    (Blue border and light background)
```

---

This visual guide helps developers and designers understand the UI structure and styling patterns used throughout the application.
