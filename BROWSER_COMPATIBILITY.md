# Browser Compatibility Guide

This document details the browser compatibility strategy and implementation for the Medical Report Digitization System frontend.

## Supported Browsers

### Desktop Browsers

| Browser | Minimum Version | Status | Notes |
|---------|----------------|--------|-------|
| Chrome | 88+ | ✅ Fully Supported | Primary target browser |
| Firefox | 85+ | ✅ Fully Supported | All features tested |
| Safari | 14+ | ✅ Fully Supported | iOS Safari 14+ |
| Edge | 88+ (Chromium) | ✅ Fully Supported | Chromium-based only |
| Opera | 74+ | ✅ Supported | Based on Chromium |
| Brave | Latest | ✅ Supported | Based on Chromium |

### Mobile Browsers

| Browser | Platform | Status | Notes |
|---------|----------|--------|-------|
| Chrome Mobile | Android 8+ | ✅ Fully Supported | Touch-optimized |
| Safari Mobile | iOS 14+ | ✅ Fully Supported | Special viewport handling |
| Firefox Mobile | Android 8+ | ✅ Supported | Tested on recent versions |
| Samsung Internet | 13+ | ✅ Supported | Samsung devices |
| Opera Mobile | Latest | ✅ Supported | Limited testing |

### Not Supported

| Browser | Status | Reason |
|---------|--------|--------|
| Internet Explorer 11 | ❌ Not Supported | Modern JS features, CSS Grid/Flexbox |
| Safari < 14 | ⚠️ Limited Support | Missing backdrop-filter, CSS features |
| Opera Mini | ❌ Not Supported | Proxy-based rendering issues |

## Browser-Specific Implementations

### Safari (macOS & iOS)

#### Backdrop Filter
Safari requires `-webkit-` prefix for backdrop blur effects:

```css
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px); /* Safari */
}
```

**Fallback:**
```css
@supports not (backdrop-filter: blur(4px)) {
  .backdrop-blur-sm {
    background-color: rgba(0, 0, 0, 0.6);
  }
}
```

#### iOS Viewport Height Issue
iOS Safari has issues with `100vh` when the address bar is visible:

**Solution in index.html:**
```javascript
function setVH() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');
}

setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);
```

**Usage in CSS:**
```css
.min-h-screen {
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
}
```

#### File Input on iOS
iOS Safari handles file inputs differently, especially for camera access:

**Implementation in FileUploader.jsx:**
```jsx
<input
  type="file"
  accept=".jpg,.jpeg,.png,.pdf"
  capture="environment" // For camera on mobile
/>
```

#### Touch Events
iOS requires specific touch event handling:

```jsx
onTouchStart={(e) => {
  // Prevent default to avoid scrolling issues
  e.stopPropagation();
}}
```

#### Modal Body Scroll Lock
iOS Safari needs special handling to prevent body scroll:

```jsx
useEffect(() => {
  if (isOpen) {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    };
  }
}, [isOpen]);
```

### Firefox

#### Scrollbar Styling
Firefox uses different scrollbar properties:

```css
/* Webkit browsers (Chrome, Safari) */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
```

#### Backdrop Filter
Firefox supports `backdrop-filter` natively (version 103+):

```css
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
```

For older Firefox versions, fallback is provided:
```css
@supports not (backdrop-filter: blur(4px)) {
  .backdrop-blur-sm {
    background-color: rgba(0, 0, 0, 0.6);
  }
}
```

### Chrome

#### Autofill Styling
Chrome applies default blue background to autofilled inputs:

**Solution in index.css:**
```css
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: inherit;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset;
  transition: background-color 5000s ease-in-out 0s;
}
```

#### Drag and Drop
Chrome has excellent drag-and-drop support. Implementation in FileUploader.jsx:

```jsx
const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    handleFileChange(files[0]);
  }
};
```

### Edge (Chromium)

Edge Chromium shares Chrome's rendering engine, so most Chrome solutions work:

- Autofill styling: Same as Chrome
- Backdrop filter: Supported natively
- Drag and drop: Full support
- CSS Grid/Flexbox: Full support

### Mobile Browsers

#### Touch Target Sizing
All touch targets are minimum 44x44px (per Apple's HIG):

```css
@media (max-width: 768px) {
  button,
  a,
  input[type='checkbox'],
  input[type='radio'] {
    min-height: 44px;
    min-width: 44px;
  }
}
```

#### Responsive Images
Use `object-fit` for proper image scaling on mobile:

```jsx
<img
  src={imageUrl}
  alt="Medical Report"
  className="max-w-full h-auto object-contain"
  style={{ objectFit: 'contain' }}
/>
```

#### Touch Events vs Mouse Events
Components handle both touch and mouse events:

```jsx
// Drag and drop also works with touch on mobile
onDragStart={handleDragStart}
onTouchStart={handleTouchStart}
```

## CSS Feature Detection

The application uses `@supports` for progressive enhancement:

### Backdrop Filter
```css
@supports (backdrop-filter: blur(4px)) {
  .modal-backdrop {
    backdrop-filter: blur(4px);
  }
}

@supports not (backdrop-filter: blur(4px)) {
  .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.7);
  }
}
```

### CSS Grid
```css
@supports (display: grid) {
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@supports not (display: grid) {
  .grid-container {
    display: flex;
    flex-wrap: wrap;
  }
}
```

## JavaScript Polyfills

Polyfills are included via `core-js` and `regenerator-runtime`:

### In main.jsx:
```javascript
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

### Polyfilled Features:
- Promise
- async/await
- fetch API
- Array methods (map, filter, reduce, find, etc.)
- Object methods (assign, entries, values, keys)
- String methods (includes, startsWith, endsWith)
- Symbol
- Set, Map, WeakMap, WeakSet

## Vendor Prefixes

Autoprefixer automatically adds vendor prefixes during build:

### PostCSS Config:
```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // Adds vendor prefixes
  },
}
```

### Browserslist Config:
```
# .browserslistrc
[production]
>0.2%
not dead
not op_mini all

[development]
last 1 chrome version
last 1 firefox version
last 1 safari version
```

## Testing Strategy

### Manual Testing Matrix

| Feature | Chrome | Firefox | Safari | Edge | Mobile Safari | Chrome Mobile |
|---------|--------|---------|--------|------|---------------|---------------|
| File Upload | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Drag & Drop | ✅ | ✅ | ✅ | ✅ | N/A | N/A |
| Modal Display | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Backdrop Blur | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Image Zoom | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Form Editing | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Responsive Layout | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Automated Testing

**Recommended tools:**
- **BrowserStack:** Cross-browser testing service
- **Playwright:** Multi-browser E2E testing
- **Cypress:** Modern E2E testing framework

**Example Playwright config:**
```javascript
// playwright.config.js
export default {
  projects: [
    { name: 'Chrome', use: { browserName: 'chromium' } },
    { name: 'Firefox', use: { browserName: 'firefox' } },
    { name: 'Safari', use: { browserName: 'webkit' } },
  ],
};
```

### Device Testing

**Recommended devices for testing:**

**Mobile:**
- iPhone SE (smallest iOS screen)
- iPhone 12/13/14 (standard iOS)
- iPhone 14 Pro Max (largest iOS)
- Samsung Galaxy S21 (Android)
- iPad Mini (small tablet)
- iPad Pro (large tablet)

**Desktop:**
- 1366x768 (common laptop)
- 1920x1080 (full HD)
- 2560x1440 (2K)
- 3840x2160 (4K)

## Common Issues & Solutions

### Issue: Modal not scrolling on iOS
**Symptom:** Modal content cut off, can't scroll

**Solution:** Use `-webkit-overflow-scrolling: touch`
```css
.modal-content {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

### Issue: File input not working on iOS Safari
**Symptom:** Camera doesn't open, file picker issues

**Solution:** Add proper accept and capture attributes
```jsx
<input
  type="file"
  accept="image/*,.pdf"
  capture="environment"
/>
```

### Issue: Backdrop blur not showing in older browsers
**Symptom:** Modal background is solid, not blurred

**Solution:** Already handled with fallback (see Safari section)

### Issue: Drag and drop not working on mobile
**Symptom:** Can't drag files on touchscreen

**Solution:** Provide click-to-upload fallback (already implemented)

### Issue: Text inputs zooming on focus (iOS)
**Symptom:** Page zooms when tapping input fields

**Solution:** Set minimum font size to 16px
```css
input, textarea {
  font-size: 16px; /* Prevents zoom on iOS */
}
```

### Issue: Autofill changing input colors
**Symptom:** Chrome shows blue background on autofilled inputs

**Solution:** Already handled in index.css (see Chrome section)

## Performance Considerations

### Bundle Size Optimization
- Tree-shaking with Vite
- Code splitting by route
- Dynamic imports for heavy components
- Minimal polyfills (only what's needed)

### Image Optimization
- Lazy loading for images
- Progressive image loading
- Proper image formats (WebP with fallback)
- Responsive images with `srcset`

### CSS Optimization
- PurgeCSS removes unused Tailwind classes
- Minification in production
- Critical CSS inlined
- CSS splitting by route

## Future Improvements

### Progressive Web App (PWA)
- Add service worker for offline support
- Cache static assets
- Background sync for failed uploads
- Install prompt for mobile devices

### Enhanced Mobile Support
- Add haptic feedback on touch interactions
- Implement swipe gestures for image gallery
- Add pull-to-refresh functionality
- Optimize for foldable devices

### Accessibility Enhancements
- Add voice control support
- Implement screen reader optimizations
- Add high contrast mode toggle
- Support for reduced motion preferences

## Resources

### Official Documentation
- [Tailwind CSS Browser Support](https://tailwindcss.com/docs/browser-support)
- [React Browser Support](https://react.dev/learn#browser-support)
- [MDN Web Docs - Browser Compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports)
- [Can I Use](https://caniuse.com/)

### Testing Tools
- [BrowserStack](https://www.browserstack.com/)
- [Playwright](https://playwright.dev/)
- [Cypress](https://www.cypress.io/)
- [LambdaTest](https://www.lambdatest.com/)

### Debugging Tools
- Chrome DevTools
- Firefox Developer Tools
- Safari Web Inspector
- Edge DevTools

---

Last Updated: November 12, 2024
Maintainer: Mohamed - Kyushu University
