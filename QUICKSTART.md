# Quick Start Guide

Get the Medical Report Digitization System frontend up and running in 5 minutes!

## Prerequisites

- ✅ Node.js 16+ installed
- ✅ npm 8+ installed
- ✅ Django backend running on `http://localhost:80`

## Installation

### Step 1: Install Dependencies

```bash
cd medical-digitization-frontend
npm install
```

This will install:
- React 18
- Tailwind CSS 3
- Vite
- React Router
- Polyfills for browser compatibility

### Step 2: Configure Backend URL

Open `src/actions/medicalReports.js` and update the base URL:

```javascript
const BASE_URL = 'http://localhost:8000'; // Your Django backend URL
```

### Step 3: Start Development Server

```bash
npm run dev
```

The app will open at: **http://localhost:3000**

## Testing the Application

### 1. Open the Application
Navigate to `http://localhost:3000` in your browser

### 2. Fill in Required Fields
- **Patient ID:** Enter any test patient ID (e.g., "123")
- **Healthcare Worker ID:** Enter any test worker ID (e.g., "456")

### 3. Upload a Medical Report
- Drag and drop a medical report image (JPG, PNG, PDF)
- Or click the upload area to browse files
- Maximum file size: 10MB

### 4. Watch the Magic! ✨
- System classifies the report type
- Extracts structured data automatically
- Opens review modal with split-screen view

### 5. Review and Edit
- Edit any extracted field by clicking on it
- Add new fields with "Add Field" button
- Zoom/pan the image for reference
- Delete unwanted fields

### 6. Confirm and Save
- Click "Confirm & Save"
- Data is sent to your Django backend
- Success! Ready for next report

## Common Issues

### Backend Connection Error
**Problem:** Can't connect to Django backend

**Solution:**
1. Make sure Django is running: `python manage.py runserver`
2. Check backend URL in `src/actions/medicalReports.js`
3. Enable CORS in Django settings:
   ```python
   # settings.py
   INSTALLED_APPS = [
       ...
       'corsheaders',
   ]
   
   MIDDLEWARE = [
       'corsheaders.middleware.CorsMiddleware',
       ...
   ]
   
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
   ]
   ```

### File Upload Not Working
**Problem:** Files don't upload or return errors

**Solution:**
1. Check file size (must be < 10MB)
2. Verify file format (JPG, PNG, or PDF only)
3. Check Django `MEDIA_ROOT` configuration
4. Ensure Django endpoint `/smrd/digitize/` exists

### Modal Not Showing
**Problem:** Extraction modal doesn't appear

**Solution:**
1. Check browser console for errors
2. Ensure extractedData is not null
3. Try different browser (Chrome recommended)

## Development Tips

### Hot Reload
Vite provides instant hot reload. Just save your files and see changes immediately!

### Browser DevTools
- Press `F12` to open DevTools
- Check Console tab for errors
- Use Network tab to debug API calls
- Use React DevTools extension for component debugging

### Responsive Testing
Test on different screen sizes:
1. Open DevTools (`F12`)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select different devices (iPhone, iPad, etc.)

### Cross-Browser Testing
Test on multiple browsers:
- Chrome (primary)
- Firefox
- Safari (if on Mac)
- Edge

## Project Structure Overview

```
src/
├── actions/medicalReports.js    # API calls to backend
├── components/                   # Reusable UI components
│   ├── FileUploader.jsx         # File upload with drag-and-drop
│   ├── StatusIndicator.jsx      # Processing status display
│   ├── ExtractionModal.jsx      # Data review modal
│   └── EditableField.jsx        # Inline editable fields
├── pages/
│   └── DigitizePage.jsx         # Main page with workflow
├── App.jsx                       # Root component with routing
├── main.jsx                      # App entry point
└── index.css                     # Global styles
```

## Next Steps

### Customize Styling
Edit `tailwind.config.js` to change colors and styles:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color', // Change primary color
      },
    },
  },
}
```

### Add New Features
1. Create new component in `src/components/`
2. Import and use in `DigitizePage.jsx`
3. Style with Tailwind CSS classes

### Deploy to Production
```bash
npm run build
```

This creates optimized files in `dist/` folder ready for deployment.

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check code style

# Dependencies
npm install              # Install dependencies
npm update               # Update dependencies
npm audit fix            # Fix security issues
```

## Getting Help

### Documentation
- 📖 Full README: See `README.md`
- 🌐 Browser Compatibility: See `BROWSER_COMPATIBILITY.md`
- 💬 Component docs: Check JSDoc comments in code

### Resources
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

### Troubleshooting
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf .vite && npm run dev`
3. Check browser console for errors
4. Verify backend is running and accessible

## What's Next?

Now that you're up and running:

1. ✅ Test the basic workflow
2. ✅ Upload different types of medical reports
3. ✅ Test on mobile devices
4. ✅ Customize styling to match your brand
5. ✅ Add authentication if needed
6. ✅ Deploy to production

Happy coding! 🚀

---

**Need help?**
- Check the full README.md for detailed documentation
- Review component code - it's well-commented
- Test in different browsers for compatibility

**Found a bug?**
- Check browser console for errors
- Verify backend is responding correctly
- Try in a different browser to isolate the issue
