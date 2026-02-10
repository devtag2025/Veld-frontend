# Contract Management System - Quick Start Guide

## ✅ Implementation Checklist

### Phase 1: Frontend Setup (Day 1)

- [ ] **Install Dependencies**
  ```bash
  npm install pdf-lib date-fns
  ```

- [ ] **Copy Files**
  - [ ] Copy all files from `contract-system/` to your project
  - [ ] Maintain directory structure exactly as shown
  - [ ] Verify all imports are correct

- [ ] **Update Router**
  - [ ] Add route in your router configuration
  - [ ] Test navigation to `/dashboard/contracts`

- [ ] **Add Navigation Link**
  - [ ] Add "Contracts" link in dashboard sidebar
  - [ ] Add icon (FileText from lucide-react)

### Phase 2: Backend Setup (Day 2-3)

- [ ] **Database Schema**
  - [ ] Create Contract model/schema
  - [ ] Create Template model/schema
  - [ ] Set up indexes for performance
  - [ ] Add validation rules

- [ ] **API Routes**
  - [ ] Implement GET /api/contracts
  - [ ] Implement GET /api/contracts/stats
  - [ ] Implement GET /api/contracts/:id
  - [ ] Implement POST /api/contracts
  - [ ] Implement PUT /api/contracts/:id
  - [ ] Implement DELETE /api/contracts/:id
  - [ ] Implement POST /api/contracts/:id/send-email
  - [ ] Implement POST /api/contracts/bulk-action
  - [ ] Implement all template endpoints

- [ ] **Middleware**
  - [ ] Add authentication middleware
  - [ ] Add authorization (admin-only) middleware
  - [ ] Add input validation middleware
  - [ ] Add error handling middleware

### Phase 3: Integration & Testing (Day 4-5)

- [ ] **Frontend-Backend Connection**
  - [ ] Set VITE_API_BASE_URL in .env
  - [ ] Test all API calls
  - [ ] Handle loading states
  - [ ] Handle error states

- [ ] **PDF Generation Testing**
  - [ ] Test PDF preview
  - [ ] Test PDF download
  - [ ] Test PDF email sending
  - [ ] Test PDF printing

- [ ] **End-to-End Testing**
  - [ ] Create new contract
  - [ ] Edit existing contract
  - [ ] Delete contract
  - [ ] Filter contracts
  - [ ] Search contracts
  - [ ] Bulk operations
  - [ ] Template management

### Phase 4: Polish & Deploy (Day 6-7)

- [ ] **UI/UX Refinements**
  - [ ] Adjust colors to match brand
  - [ ] Optimize for mobile/tablet
  - [ ] Add loading animations
  - [ ] Improve error messages

- [ ] **Documentation**
  - [ ] Document custom configurations
  - [ ] Create user guide
  - [ ] Document API endpoints
  - [ ] Add inline code comments

- [ ] **Deployment**
  - [ ] Deploy backend
  - [ ] Deploy frontend
  - [ ] Set production environment variables
  - [ ] Test in production

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install pdf-lib date-fns

# 2. Create environment file
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

# 3. Start development server
npm run dev

# 4. Navigate to contracts page
# http://localhost:5173/dashboard/contracts
```

## 📋 Common Tasks

### Adding a New Field to Contracts

1. **Update Form** (`CreateContractModal.jsx`):
```javascript
// Add new field to form
<div>
  <label>New Field</label>
  <input {...register('newField')} />
</div>
```

2. **Update Service** (`contractService.js`):
```javascript
// Already handles dynamic fields - no changes needed
```

3. **Update PDF** (`pdfGenerator.js`):
```javascript
// Add to PDF generation
addText(`New Field: ${contract.newField}`, 10, helveticaFont);
```

4. **Update Backend Schema**:
```javascript
// Add to schema
newField: { type: String }
```

### Customizing Email Templates

Create email templates in backend:

```javascript
// emailTemplates.js
const contractEmail = (hunterName, contractId) => ({
  subject: `Your Hunt Contract - ${contractId}`,
  html: `
    <h1>Dear ${hunterName},</h1>
    <p>Your hunt contract is ready for review.</p>
    <p>Please review the attached contract and sign it at your earliest convenience.</p>
    <p>Best regards,<br>Karl Goodhand</p>
  `
});
```

### Adding Custom Statistics

Update `ContractsHeader.jsx`:

```javascript
// Add new stat card
{
  title: 'Revenue This Year',
  value: stats.revenue,
  icon: DollarSign,
  color: 'bg-purple-500',
  bgColor: 'bg-purple-50',
  textColor: 'text-purple-700'
}
```

## 🔍 Testing Scenarios

### Manual Testing Checklist

**Contract Creation:**
- [ ] Create contract with all fields filled
- [ ] Create contract with minimum required fields
- [ ] Test form validation (empty required fields)
- [ ] Test email validation
- [ ] Test date validation

**Contract Management:**
- [ ] View contract in table
- [ ] Edit existing contract
- [ ] Delete contract
- [ ] Bulk select and delete multiple contracts

**Filtering & Search:**
- [ ] Search by hunter name
- [ ] Search by email
- [ ] Search by contract ID
- [ ] Filter by status
- [ ] Filter by package type
- [ ] Filter by date range
- [ ] Combine multiple filters

**PDF Generation:**
- [ ] Generate PDF preview
- [ ] Download PDF
- [ ] Print PDF
- [ ] Send PDF via email
- [ ] Verify all contract data appears in PDF

**Template Management:**
- [ ] Create new template
- [ ] Edit template
- [ ] Duplicate template
- [ ] Delete non-default template
- [ ] Set template as default
- [ ] Use template when creating contract

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'pdf-lib'"
**Solution:**
```bash
npm install pdf-lib
# or
yarn add pdf-lib
```

### Issue: "CORS error when calling API"
**Solution:** Configure CORS on backend
```javascript
// Express.js example
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: "PDF shows blank page"
**Solution:** Check browser console for errors. Ensure contract object has all required fields.

### Issue: "Cannot read property 'map' of undefined"
**Solution:** Add null check before mapping:
```javascript
{contracts?.map((contract) => ...)}
```

### Issue: "Styles not applying"
**Solution:** 
1. Verify Tailwind is configured
2. Check class names are correct
3. Run build command: `npm run build`

## 📊 Performance Optimization

### Backend Optimization

```javascript
// Add indexes for faster queries
contractSchema.index({ hunterName: 'text', email: 'text' });
contractSchema.index({ status: 1, huntDate: -1 });
contractSchema.index({ createdAt: -1 });

// Pagination implementation
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const contracts = await Contract.find(query)
  .skip(skip)
  .limit(limit)
  .sort({ createdAt: -1 });
```

### Frontend Optimization

```javascript
// Use React Query for caching
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['contracts', filters],
  queryFn: () => contractService.getContracts(filters),
  staleTime: 5 * 60 * 1000 // 5 minutes
});
```

## 🔐 Security Best Practices

1. **Always validate on backend**
```javascript
const { body, validationResult } = require('express-validator');

router.post('/contracts', [
  body('hunterName').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('huntDate').isISO8601(),
  // ... more validations
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

2. **Sanitize file names**
```javascript
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-z0-9_\-\.]/gi, '_');
};
```

3. **Rate limit email sending**
```javascript
const rateLimit = require('express-rate-limit');

const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 requests per windowMs
});

router.post('/contracts/:id/send-email', emailLimiter, ...);
```

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Review inline code comments
- Check browser console for errors
- Check server logs for API errors
- Refer to the requirements document

---

**Quick Links:**
- [Main Documentation](./README.md)
- [API Reference](./API_REFERENCE.md)
- [Component Documentation](./COMPONENTS.md)

Last Updated: February 2026
