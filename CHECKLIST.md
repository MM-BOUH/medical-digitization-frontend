# Setup & Deployment Checklist

Complete checklist for setting up, testing, and deploying the Medical Report Digitization System frontend.

---

## 📋 Pre-Installation Checklist

### System Requirements
- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm 8+ installed (`npm --version`)
- [ ] Git installed (for version control)
- [ ] Code editor (VS Code, Sublime, etc.)

### Backend Requirements
- [ ] Django backend server running
- [ ] Backend accessible at known URL (e.g., `http://localhost:8000`)
- [ ] `/smrd/digitize/` endpoint working
- [ ] CORS configured in Django settings

### Browser Requirements
- [ ] Modern browser installed (Chrome 88+, Firefox 85+, Safari 14+, or Edge 88+)
- [ ] React DevTools extension (optional but recommended)

---

## 🚀 Installation Checklist

### Step 1: Download/Clone Project
- [ ] Project files downloaded or cloned
- [ ] Navigate to project directory: `cd medical-digitization-frontend`
- [ ] Verify all files present (check FILE_INDEX.md)

### Step 2: Install Dependencies
```bash
npm install
```
- [ ] Command executed successfully
- [ ] No major errors in installation
- [ ] node_modules folder created
- [ ] package-lock.json created

**Expected output:** ~2000 packages installed in ~2 minutes

### Step 3: Configure Backend URL
- [ ] Open `src/actions/medicalReports.js`
- [ ] Update `BASE_URL` constant to match your Django backend
- [ ] Save file

```javascript
// Change this line:
const BASE_URL = 'http://localhost:8000'; // Your backend URL
```

### Step 4: Verify Configuration Files
- [ ] `package.json` - Check scripts are present
- [ ] `vite.config.js` - Verify proxy settings if needed
- [ ] `tailwind.config.js` - Check content paths
- [ ] `.browserslistrc` - Verify browser targets

### Step 5: Start Development Server
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] Application accessible at `http://localhost:3000`
- [ ] No console errors in terminal
- [ ] Hot reload working (test by editing a file)

---

## 🧪 Testing Checklist

### Frontend Functionality Tests

#### File Upload
- [ ] Drag and drop works
- [ ] Click to browse works
- [ ] Image preview displays correctly
- [ ] File validation works (try invalid file type)
- [ ] File size validation works (try > 10MB file)
- [ ] Clear/remove file works

#### Form Validation
- [ ] Patient ID is required (test submit without it)
- [ ] Healthcare Worker ID is required (test submit without it)
- [ ] Both IDs accept alphanumeric input
- [ ] Form resets after successful submission

#### Status Transitions
- [ ] "Analyzing document..." appears during upload
- [ ] Spinner animation works
- [ ] Classification result displays correctly
- [ ] "Extracting data..." appears
- [ ] Success state shows after extraction
- [ ] Error state shows for invalid files
- [ ] "Not a medical report" shows when appropriate

#### Modal Functionality
- [ ] Modal opens after successful extraction
- [ ] Backdrop blur effect works
- [ ] Image displays in left panel
- [ ] Zoom controls work (-, +, Reset)
- [ ] Image zoom/pan works
- [ ] Form displays in right panel
- [ ] Metadata fields are editable
- [ ] Result fields are editable
- [ ] Add field button works
- [ ] Delete field button works
- [ ] Add section button works
- [ ] Delete section button works
- [ ] Cancel button closes modal
- [ ] Confirm & Save button works
- [ ] Modal closes after save
- [ ] Body scroll is locked when modal open
- [ ] ESC key closes modal

### Backend Integration Tests

#### API Connectivity
- [ ] POST /smrd/digitize/ endpoint reachable
- [ ] File upload successful
- [ ] Response format matches expected structure
- [ ] Error responses handled correctly
- [ ] Network errors handled gracefully

#### Data Flow
- [ ] Extracted data populates modal correctly
- [ ] Metadata displays in correct fields
- [ ] Results array renders properly
- [ ] Nested data structures handled
- [ ] Empty fields handled gracefully

#### Save Functionality
- [ ] POST /smrd/save-extracted-data/ works
- [ ] Edited data sent correctly
- [ ] Success response handled
- [ ] Error response handled
- [ ] Form resets after save

### Responsive Design Tests

#### Mobile Portrait (320px - 639px)
- [ ] Layout is single column
- [ ] All elements fit without horizontal scroll
- [ ] Touch targets are at least 44x44px
- [ ] Text is readable (minimum 14px)
- [ ] Buttons are full-width
- [ ] Modal is full-screen
- [ ] Image section has fixed height
- [ ] Form section is scrollable

#### Mobile Landscape (480px - 767px)
- [ ] Layout adapts to horizontal orientation
- [ ] All elements remain accessible
- [ ] Modal uses available space efficiently

#### Tablet Portrait (768px - 1023px)
- [ ] Two-column layout for form inputs
- [ ] Upload area is centered
- [ ] Modal split-screen begins (50/50 or tabs)
- [ ] Enhanced spacing applied
- [ ] All touch interactions work

#### Tablet Landscape (1024px - 1279px)
- [ ] Full split-screen modal (40/60)
- [ ] Desktop-like layout
- [ ] Image panel fixed, form panel scrollable
- [ ] Optimal spacing and sizing

#### Desktop (1280px+)
- [ ] Maximum utilization of space
- [ ] Modal centered with max-width
- [ ] All elements properly sized
- [ ] Hover effects work

#### Large Desktop (1920px+)
- [ ] Centered containers with max-width
- [ ] No excessive stretching
- [ ] Optimal reading width maintained

### Cross-Browser Tests

#### Chrome (Latest 3 versions)
- [ ] All features work
- [ ] Drag and drop works
- [ ] Autofill styling correct
- [ ] Animations smooth
- [ ] Console has no errors

#### Firefox (Latest 3 versions)
- [ ] All features work
- [ ] Scrollbars styled correctly
- [ ] Backdrop filter works or fallback applied
- [ ] Console has no errors

#### Safari (Desktop, Latest 2 versions)
- [ ] All features work
- [ ] Backdrop filter works with -webkit prefix
- [ ] File input works
- [ ] Console has no errors

#### Safari (iOS 14+)
- [ ] All features work on iPhone
- [ ] Viewport height issues handled
- [ ] Touch events work
- [ ] Modal scroll lock works
- [ ] Camera access works for file input
- [ ] No horizontal scroll

#### Edge (Chromium, Latest 3 versions)
- [ ] All features work
- [ ] Same as Chrome compatibility
- [ ] Console has no errors

#### Mobile Chrome (Android)
- [ ] All features work
- [ ] Touch interactions smooth
- [ ] File upload works
- [ ] Responsive layouts correct

#### Samsung Internet
- [ ] Basic functionality works
- [ ] Layout displays correctly

### Accessibility Tests

#### Keyboard Navigation
- [ ] Tab key moves through all interactive elements
- [ ] Enter key activates buttons
- [ ] Escape key closes modal
- [ ] Focus indicators visible
- [ ] Tab order is logical

#### Screen Reader
- [ ] All images have alt text
- [ ] All buttons have aria-labels
- [ ] Form inputs have labels
- [ ] Status updates announced
- [ ] Modal focus trapped when open

#### Visual
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators have 2px outline
- [ ] No color-only indicators
- [ ] Text readable at all sizes

### Performance Tests

#### Load Time
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.0s
- [ ] Total bundle size < 200KB gzipped

#### Runtime Performance
- [ ] No jank during animations
- [ ] Smooth scrolling
- [ ] Fast file upload
- [ ] Quick modal open/close
- [ ] No memory leaks (check DevTools)

---

## 🔒 Security Checklist

### Frontend Security
- [ ] No sensitive data in localStorage
- [ ] No console.log of sensitive data
- [ ] File type validation enabled
- [ ] File size limits enforced
- [ ] Input sanitization (XSS prevention)

### Backend Communication
- [ ] HTTPS used in production
- [ ] CORS properly configured
- [ ] API endpoints authenticated (if required)
- [ ] Error messages don't leak sensitive info

---

## 📦 Production Build Checklist

### Pre-Build
- [ ] All tests passing
- [ ] No console errors
- [ ] Code reviewed
- [ ] Comments added where needed
- [ ] README updated if changes made

### Build Process
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] `dist/` folder created
- [ ] Files are minified
- [ ] Source maps generated (optional)
- [ ] Assets optimized

### Post-Build Verification
```bash
npm run preview
```
- [ ] Preview server starts
- [ ] Application works in production mode
- [ ] All features functional
- [ ] No console errors
- [ ] Performance is good

### Build Output Checks
- [ ] index.html present in dist/
- [ ] CSS files generated
- [ ] JS files generated and chunked
- [ ] Assets copied correctly
- [ ] File sizes reasonable

---

## 🚀 Deployment Checklist

### Pre-Deployment

#### Environment Configuration
- [ ] Backend URL updated for production
- [ ] Environment variables configured
- [ ] API keys secured (if any)
- [ ] CORS origins updated in Django

#### Files to Update
- [ ] `src/actions/medicalReports.js` - Production backend URL
- [ ] `vite.config.js` - Production settings if needed
- [ ] Environment variables set

### Deployment Options

#### Option 1: Static Hosting (Vercel/Netlify)
- [ ] Account created
- [ ] Repository connected (if using Git)
- [ ] Build command set: `npm run build`
- [ ] Output directory set: `dist`
- [ ] Environment variables configured
- [ ] Deploy triggered
- [ ] Deployment successful
- [ ] Custom domain configured (optional)
- [ ] SSL certificate enabled

#### Option 2: Serve with Django
- [ ] Build completed: `npm run build`
- [ ] dist/ copied to Django static folder
- [ ] Django static files configured
- [ ] URLs updated to point to Django
- [ ] collectstatic run
- [ ] Server restarted
- [ ] Application accessible

#### Option 3: Docker Deployment
- [ ] Dockerfile created (see README)
- [ ] Docker image built
- [ ] Image tested locally
- [ ] Image pushed to registry
- [ ] Container deployed
- [ ] Health check passing

### Post-Deployment Verification

#### Functionality Tests
- [ ] Application loads correctly
- [ ] All features work
- [ ] Backend API accessible
- [ ] File upload works
- [ ] Data save works
- [ ] No console errors

#### Performance Tests
- [ ] Page load time acceptable
- [ ] Images load quickly
- [ ] API responses fast
- [ ] No 404 errors for assets

#### Cross-Browser Tests (Production)
- [ ] Chrome works
- [ ] Firefox works
- [ ] Safari works
- [ ] Edge works
- [ ] Mobile Chrome works
- [ ] Mobile Safari works

#### Responsive Tests (Production)
- [ ] Mobile portrait works
- [ ] Mobile landscape works
- [ ] Tablet works
- [ ] Desktop works
- [ ] Large desktop works

#### Security Tests
- [ ] HTTPS enabled
- [ ] No mixed content warnings
- [ ] CORS working correctly
- [ ] No XSS vulnerabilities
- [ ] No sensitive data exposed

---

## 📝 Documentation Checklist

### User Documentation
- [ ] README.md up to date
- [ ] QUICKSTART.md clear and accurate
- [ ] Screenshots added (optional)
- [ ] Video tutorial created (optional)

### Developer Documentation
- [ ] FILE_INDEX.md complete
- [ ] ARCHITECTURE.md accurate
- [ ] BROWSER_COMPATIBILITY.md current
- [ ] Code comments adequate
- [ ] API documentation linked

### Deployment Documentation
- [ ] Deployment steps documented
- [ ] Environment variables listed
- [ ] Troubleshooting guide updated
- [ ] Rollback procedure documented

---

## 🔧 Maintenance Checklist

### Regular Updates
- [ ] Dependencies updated monthly: `npm update`
- [ ] Security vulnerabilities checked: `npm audit`
- [ ] Critical updates applied immediately
- [ ] Breaking changes tested before updating

### Monitoring
- [ ] Error tracking set up (optional)
- [ ] Performance monitoring set up (optional)
- [ ] User feedback collected
- [ ] Analytics configured (optional)

### Backup
- [ ] Code in version control (Git)
- [ ] Backup of production database (Django side)
- [ ] Configuration files backed up
- [ ] Deployment scripts saved

---

## ✅ Final Verification

Before marking the project as complete, verify:

### Code Quality
- [ ] No lint errors: `npm run lint`
- [ ] Code is clean and readable
- [ ] No TODO comments remaining
- [ ] No console.log statements in production code

### Functionality
- [ ] All user stories completed
- [ ] All acceptance criteria met
- [ ] No known critical bugs
- [ ] Performance meets requirements

### Documentation
- [ ] All documentation complete
- [ ] Installation steps verified
- [ ] API documentation accurate
- [ ] Known issues documented

### Testing
- [ ] Unit tests passing (if implemented)
- [ ] Integration tests passing (if implemented)
- [ ] Manual testing complete
- [ ] Cross-browser testing complete
- [ ] Responsive testing complete

### Deployment
- [ ] Application deployed successfully
- [ ] Production environment tested
- [ ] Backup and rollback plans ready
- [ ] Monitoring in place

---

## 🎉 Launch Checklist

Final steps before going live:

- [ ] Stakeholders notified
- [ ] User training completed (if needed)
- [ ] Support documentation ready
- [ ] Feedback mechanism in place
- [ ] Monitoring active
- [ ] Team ready for support
- [ ] Launch announcement prepared
- [ ] 🚀 **GO LIVE!**

---

## 📞 Support & Troubleshooting

If issues arise during setup or deployment:

1. **Check the documentation first:**
   - README.md
   - QUICKSTART.md
   - BROWSER_COMPATIBILITY.md

2. **Common issues:**
   - CORS errors → Check Django CORS settings
   - Build errors → Clear node_modules and reinstall
   - API errors → Verify backend URL and endpoints
   - Styling issues → Check Tailwind config and build

3. **Debug steps:**
   - Check browser console for errors
   - Check terminal for build errors
   - Verify all dependencies installed
   - Test in different browser
   - Clear cache and hard reload

4. **Contact information:**
   - Developer: Mohamed
   - Institution: Kyushu University
   - Lab: Social Tech Lab

---

**Last Updated:** November 12, 2024
**Version:** 1.0.0
**Status:** Production-Ready ✅

Use this checklist to ensure a smooth setup, testing, and deployment process!
