# Medical Report Digitization System - Frontend

A modern, responsive React + Tailwind CSS frontend for automated medical report classification and data extraction.

## Features

✨ **Core Functionality**
- Drag-and-drop file upload with preview
- Real-time status updates during processing
- Automatic document classification (Hematology, Clinical Chemistry, Microbiology, etc.)
- AI-powered data extraction
- Interactive data review and editing
- Split-screen modal with image preview and form

📱 **Responsive Design**
- Mobile-first approach
- Supports all screen sizes (320px - 1920px+)
- Touch-optimized for tablets and smartphones
- Adaptive layouts for portrait and landscape orientations

🌐 **Cross-Browser Compatible**
- Chrome, Firefox, Safari, Edge (latest 3 versions)
- Mobile browsers (Chrome Mobile, Safari Mobile, Samsung Internet)
- Polyfills for legacy browser support
- Graceful degradation for older browsers

♿ **Accessibility**
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast text
- Minimum 44px touch targets

## Tech Stack

- **React 18** - UI framework
- **Tailwind CSS 3** - Utility-first styling
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Core-js** - Polyfills for older browsers
- **Autoprefixer** - CSS vendor prefixing

## Project Structure

```
medical-digitization-frontend/
├── src/
│   ├── actions/
│   │   └── medicalReports.js      # API calls to Django backend
│   ├── components/
│   │   ├── FileUploader.jsx       # Drag-and-drop file upload
│   │   ├── StatusIndicator.jsx    # Status display with animations
│   │   ├── ExtractionModal.jsx    # Split-screen data review modal
│   │   └── EditableField.jsx      # Inline editable form fields
│   ├── pages/
│   │   └── DigitizePage.jsx       # Main digitization workflow page
│   ├── App.jsx                     # Root application component
│   ├── main.jsx                    # Application entry point
│   └── index.css                   # Global styles with Tailwind
├── index.html                      # HTML template
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
└── .browserslistrc                 # Browser support configuration
```

## Installation

### Prerequisites

- Node.js 16+ and npm 8+
- Running Django backend on `http://localhost:8000`

### Setup

1. **Clone or navigate to the project directory:**

```bash
cd medical-digitization-frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Update API base URL:**

Edit `src/actions/medicalReports.js` and update the `BASE_URL` constant to match your Django backend:

```javascript
const BASE_URL = 'http://localhost:8000'; // or your backend URL
```

4. **Start development server:**

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Usage

### Basic Workflow

1. **Enter IDs**
   - Enter Patient ID
   - Enter Healthcare Worker ID

2. **Upload Report**
   - Drag and drop a medical report image (JPG, PNG, etc.; PDF coming soon)
   - Or click to browse and select a file
   - File must be under 10MB

3. **Automatic Processing**
   - System classifies the report type
   - Extracts structured data automatically
   - Shows real-time status updates

4. **Review & Edit**
   - Review extracted data in split-screen modal
   - Edit any field by clicking on it
   - Add or remove fields as needed
   - Zoom/pan the image for reference

5. **Confirm & Save**
   - Click "Confirm & Save" to store the data
   - Data is sent to Django backend for storage

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Environment Configuration

Create a `.env` file for environment-specific settings:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Then update `src/actions/medicalReports.js`:

```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
```

## Backend Integration

### Expected API Endpoints

The frontend expects the following Django endpoints:

#### 1. Digitize Report

**Endpoint:** `POST /smrd/digitize/`

**Request:**
```
Content-Type: multipart/form-data

FormData:
- image: File (JPG, PNG, etc.; PDF coming soon)
- patient_id: String
- healthcare_worker_id: String
```

**Success Response:**
```json
{
  "report_type": "Hematology",
  "extracted_data": {
    "metadata": {
      "patient_name": "John Doe",
      "age": "45",
      "gender": "Male",
      "lab_name": "Central Lab",
      "doctor_name": "Dr. Smith",
      "report_date": "2024-11-10"
    },
    "results": [
      {
        "result_type": "Complete Blood Count",
        "result_data": [
          {
            "test_name": "Hemoglobin",
            "value": "14.5",
            "unit": "g/dL",
            "reference_range": "13.5-17.5"
          }
        ],
        "text_data": "",
        "image_data": "",
        "other_fields": {}
      }
    ]
  }
}
```

**Error Response:**
```json
{
  "error": "Uploaded image is not a valid medical report"
}
```

#### 2. Save Extracted Data

**Endpoint:** `POST /smrd/save-extracted-data/`

**Request:**
```json
{
  "metadata": { ... },
  "results": [ ... ],
  "report_type": "Hematology",
  "patient_id": "123",
  "healthcare_worker_id": "456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data saved successfully",
  "report_id": "789"
}
```

## Responsive Breakpoints

The application uses Tailwind's default breakpoints:

- **Mobile Portrait:** 0px - 639px (default styles)
- **Mobile Landscape / Small Tablet:** 640px+ (`sm:`)
- **Tablet Portrait:** 768px+ (`md:`)
- **Tablet Landscape / Small Desktop:** 1024px+ (`lg:`)
- **Desktop:** 1280px+ (`xl:`)
- **Large Desktop:** 1536px+ (`2xl:`)

### Responsive Behavior

#### FileUploader Component
- Mobile: Full-width, vertical layout
- Desktop: Centered with max-width constraint

#### StatusIndicator Component
- Scales icon size based on viewport
- Adjusts text size responsively

#### ExtractionModal Component
- **Mobile (< 768px):**
  - Full-screen modal
  - Image above form (stacked vertically)
  - Fixed image height (40vh)
  - Scrollable form section

- **Tablet (768px - 1023px):**
  - 90% viewport size modal
  - Side-by-side layout begins
  - Equal width split (50/50)

- **Desktop (≥ 1024px):**
  - 85% viewport size modal
  - Fixed 40/60 split (image/form)
  - Image panel: Fixed height with zoom
  - Form panel: Full-height scrollable

## Browser Compatibility

### Supported Browsers

#### Desktop
- ✅ Chrome 88+ (latest 3 versions)
- ✅ Firefox 85+ (latest 3 versions)
- ✅ Safari 14+ (latest 2 versions)
- ✅ Edge 88+ (Chromium, latest 3 versions)
- ✅ Opera 74+ (latest 2 versions)

#### Mobile
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS 14+)
- ✅ Firefox Mobile
- ✅ Samsung Internet 13+

### Browser-Specific Features

#### Safari
- `-webkit-backdrop-filter` for modal backdrop
- iOS viewport height fix implemented
- Touch event handling for iOS

#### Firefox
- Custom scrollbar styling
- Backdrop filter support

#### Chrome
- Autofill styling handled
- Drag-and-drop thoroughly tested

### Known Issues

- **IE 11:** Not supported (modern JS features required)
- **iOS Safari < 14:** Limited support (some CSS features missing)

## Performance Optimization

- Code splitting with Vite
- Lazy loading of components
- Optimized bundle size
- Image preview optimization
- Minimal re-renders with React best practices

## Accessibility Features

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation (`Tab`, `Enter`, `Escape`)
- Focus indicators
- Screen reader announcements
- High contrast text (WCAG AA compliant)
- Minimum 44px touch targets on mobile
- Alt text for images

## Testing Recommendations

### Manual Testing Checklist

- [ ] File upload (drag-and-drop and click)
- [ ] Status transitions
- [ ] Modal open/close
- [ ] Data editing and validation
- [ ] Form submission
- [ ] Error handling
- [ ] Responsive layouts (mobile, tablet, desktop)
- [ ] Cross-browser compatibility
- [ ] Touch interactions on mobile
- [ ] Keyboard navigation

### Automated Testing

Consider adding:
- **Unit tests:** Jest + React Testing Library
- **E2E tests:** Playwright or Cypress
- **Visual regression tests:** Percy or Chromatic

## Deployment

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deployment Options

1. **Static hosting:**
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

2. **Serve with backend:**
   - Build frontend and serve from Django's static files

3. **Docker:**
   - Create Dockerfile with nginx to serve static files

### Example Nginx Config

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /smrd/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Troubleshooting

### Common Issues

**Issue:** CORS errors when calling backend
**Solution:** Configure Django CORS settings:
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

**Issue:** File upload fails
**Solution:** Check Django `MEDIA_ROOT` and file size limits

**Issue:** Modal not displaying properly on mobile
**Solution:** Check for conflicting CSS, ensure viewport meta tag is present

**Issue:** Backdrop blur not working in Safari
**Solution:** Already handled with `-webkit-backdrop-filter` fallback

## Contributing

1. Follow the existing code style
2. Use Tailwind utility classes
3. Ensure responsive design works on all breakpoints
4. Test on multiple browsers
5. Add comments for complex logic
6. Update documentation

## License

Proprietary - Kyushu University Research Project

## Support

For issues or questions, contact:
- **Developer:** Mohamed
- **Institution:** Kyushu University
- **Lab:** Social Tech Lab

## Changelog

### Version 1.0.0 (2024-11-12)
- Initial release
- Complete digitization workflow
- Responsive design for all devices
- Cross-browser compatibility
- Accessibility features
