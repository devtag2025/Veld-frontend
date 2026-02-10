# Contract Management System - Implementation Guide

## Overview

This is a comprehensive contract management system for Goodhand Outback Experience, built with React, designed to handle all aspects of hunt contract creation, management, and compliance tracking.

## 📁 File Structure

```
contract-system/
├── pages/
│   └── dashboard/
│       └── Contracts.jsx                 # Main contracts page
├── components/
│   ├── layout/
│   │   └── dashboard/
│   │       └── contracts/
│   │           ├── ContractsHeader.jsx   # Header with stats
│   │           ├── ContractsTable.jsx    # Contract listing table
│   │           ├── ContractFilters.jsx   # Search & filter component
│   │           ├── CreateContractModal.jsx # Contract creation/editing modal
│   │           ├── ContractTemplateManager.jsx # Template management
│   │           └── ContractPreview.jsx   # PDF preview & generation
│   └── ui/
│       └── button.jsx                    # Reusable button component
├── services/
│   └── contractService.js                # API service layer
└── utils/
    └── pdfGenerator.js                   # PDF generation utilities
```

## 🚀 Installation

### Required Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "pdf-lib": "^1.17.1",
    "date-fns": "^3.0.0"
  }
}
```

Install dependencies:

```bash
npm install pdf-lib date-fns
```

### Existing Dependencies Used
- `react-hook-form` - Form handling
- `react-hot-toast` - Notifications
- `lucide-react` - Icons
- `axios` - API calls
- `clsx` / `tailwind-merge` - Styling

## 🎨 Features

### 1. Contract Dashboard
- **Statistics Overview**: Total contracts, signed, pending, expired
- **Visual Header**: Branded hero section with company information
- **Two-Tab Interface**: 
  - All Contracts view
  - Contract Templates view

### 2. Contract Table
- **Advanced Filtering**:
  - Full-text search (name, email, contract ID)
  - Status filter (draft, pending, signed, expired, cancelled)
  - Package type filter
  - Date range filter
- **Pagination**: Configurable items per page
- **Bulk Actions**: 
  - Bulk email sending
  - Bulk PDF download
  - Bulk deletion
- **Row Actions**:
  - View/Preview
  - Edit
  - Download PDF
  - Send via Email
  - Delete

### 3. Contract Creation/Editing
- **Hunter Information**: Name, email, phone, address
- **Hunt Details**:
  - Hunt date
  - Package selection (Standard/Premium/Custom)
  - Pickup point and notes
- **Additional Options**:
  - Charter options (Helicopter 206, etc.)
  - Firearm options (Company rifles vs. Own rifles)
  - Trophy processing
- **Template Selection**: Choose from predefined templates
- **Custom Notes**: Special requests and requirements
- **Validation**: Form validation using react-hook-form + zod

### 4. Contract Templates
- **Template Management**:
  - Create new templates
  - Edit existing templates
  - Duplicate templates
  - Delete templates (except default)
  - Set default template
- **Template Editor**:
  - Name and description
  - Customizable sections (payment terms, firearms, charter, trophy)
  - Dynamic placeholder support ({{HUNTER_NAME}}, {{HUNT_DATE}}, etc.)
  - Version control

### 5. PDF Generation
- **Using pdf-lib**: Professional PDF generation
- **Contract Components**:
  - Company header and branding
  - Hunter information
  - Hunt details
  - Payment terms and banking details
  - Firearm options with warnings
  - Trophy processing details
  - Terms and conditions
  - Signature sections
  - Company footer
- **Features**:
  - Professional formatting
  - Color-coded sections
  - Warning boxes for important information
  - Multi-page support
  - Custom fonts and styling

### 6. Preview & Distribution
- **PDF Preview**: In-browser preview before downloading
- **Multiple Actions**:
  - Download to local device
  - Print directly
  - Send via email
  - Generate fresh preview
- **HTML Fallback**: Styled HTML preview before PDF generation

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### API Endpoints

The system expects the following backend endpoints:

```
GET    /api/contracts              # List all contracts
GET    /api/contracts/stats        # Get statistics
GET    /api/contracts/:id          # Get single contract
POST   /api/contracts              # Create new contract
PUT    /api/contracts/:id          # Update contract
DELETE /api/contracts/:id          # Delete contract
POST   /api/contracts/:id/send-email # Send contract via email
GET    /api/contracts/:id/pdf      # Download PDF
POST   /api/contracts/bulk-action  # Bulk operations

GET    /api/contracts/templates    # List templates
GET    /api/contracts/templates/:id # Get template
POST   /api/contracts/templates    # Create template
PUT    /api/contracts/templates/:id # Update template
DELETE /api/contracts/templates/:id # Delete template
POST   /api/contracts/templates/:id/duplicate # Duplicate template
PATCH  /api/contracts/templates/:id/set-default # Set default
```

## 📊 Data Models

### Contract Object
```javascript
{
  id: "CON-2026-001",
  hunterName: "John Smith",
  email: "john@example.com",
  phone: "+1 555-0123",
  address: "123 Main St, City, State",
  huntDate: "2026-05-15",
  package: "Premium Package",
  pickupPoint: "Darwin Airport",
  pickupNotes: "Arriving at 2 PM",
  charterOption: "helicopter-206",
  firearmOption: "company", // or "own"
  trophyProcessing: true,
  customNotes: "Dietary restrictions: None",
  template: "default",
  status: "signed", // draft, pending, signed, expired, cancelled
  createdAt: "2026-01-10T00:00:00Z",
  signedAt: "2026-01-15T00:00:00Z",
  totalAmount: 15000,
  paidAmount: 7500
}
```

### Template Object
```javascript
{
  id: "TPL-001",
  name: "Default Hunt Contract",
  description: "Standard contract for regular hunts",
  version: "1.0",
  isDefault: true,
  content: "Contract template content with {{PLACEHOLDERS}}",
  includePaymentTerms: true,
  includeFirearmSection: true,
  includeCharterSection: true,
  includeTrophySection: true,
  customSections: [],
  createdAt: "2026-01-01T00:00:00Z",
  lastModified: "2026-01-15T00:00:00Z",
  usageCount: 45,
  status: "active"
}
```

## 🎯 Integration Steps

### 1. Copy Files to Your Project

Copy all files maintaining the directory structure:
- `/pages/dashboard/Contracts.jsx`
- `/components/layout/dashboard/contracts/*`
- `/components/ui/button.jsx`
- `/services/contractService.js`
- `/utils/pdfGenerator.js`

### 2. Update Your Router

Add the contracts route to your React Router configuration:

```javascript
import Contracts from './pages/dashboard/Contracts';

// In your routes
{
  path: '/dashboard/contracts',
  element: <Contracts />
}
```

### 3. Add Navigation Link

Update your dashboard sidebar/navigation:

```javascript
<NavLink to="/dashboard/contracts">
  <FileText className="w-5 h-5" />
  Contracts
</NavLink>
```

### 4. Backend Implementation

Implement the required API endpoints on your backend. Example using Express.js:

```javascript
// contracts.routes.js
const express = require('express');
const router = express.Router();
const contractController = require('./contractController');

router.get('/', contractController.getContracts);
router.get('/stats', contractController.getStats);
router.get('/:id', contractController.getContract);
router.post('/', contractController.createContract);
router.put('/:id', contractController.updateContract);
router.delete('/:id', contractController.deleteContract);
router.post('/:id/send-email', contractController.sendEmail);
router.post('/bulk-action', contractController.bulkAction);

// Templates
router.get('/templates', contractController.getTemplates);
router.post('/templates', contractController.createTemplate);
// ... more template routes

module.exports = router;
```

### 5. Database Schema

MongoDB schema example:

```javascript
const contractSchema = new mongoose.Schema({
  contractId: { type: String, unique: true, required: true },
  hunterName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  huntDate: { type: Date, required: true },
  package: { type: String, required: true },
  pickupPoint: String,
  pickupNotes: String,
  charterOption: { type: String, default: 'none' },
  firearmOption: { type: String, required: true },
  trophyProcessing: { type: Boolean, default: true },
  customNotes: String,
  template: { type: String, default: 'default' },
  status: { 
    type: String, 
    enum: ['draft', 'pending', 'signed', 'expired', 'cancelled'],
    default: 'draft'
  },
  totalAmount: Number,
  paidAmount: { type: Number, default: 0 },
  signedAt: Date
}, { timestamps: true });
```

## 🔐 Security Considerations

1. **Authentication**: Ensure routes are protected with authentication middleware
2. **Authorization**: Implement role-based access control (admin only)
3. **Input Validation**: Validate all inputs on the backend
4. **File Security**: Sanitize file names and paths
5. **Email Security**: Implement rate limiting for email sending

## 📱 Responsive Design

The system is fully responsive with Tailwind CSS:
- **Desktop**: Full feature set with side-by-side layouts
- **Tablet**: Stacked layouts with full functionality
- **Mobile**: Currently optimized for desktop/tablet (mobile can be added)

## 🎨 Customization

### Changing Colors

Update the color scheme in components:

```javascript
// Change primary color from blue to green
className="bg-blue-600" → className="bg-green-600"
className="text-blue-600" → className="text-green-600"
```

### Adding Custom Fields

1. Update the contract form in `CreateContractModal.jsx`
2. Add field to the data model
3. Update PDF generation in `pdfGenerator.js`
4. Update backend schema

### Custom Templates

Templates support dynamic placeholders:
- `{{HUNTER_NAME}}` - Hunter's full name
- `{{HUNT_DATE}}` - Formatted hunt date
- `{{PACKAGE_TYPE}}` - Selected package
- `{{TOTAL_AMOUNT}}` - Total package amount
- `{{DEPOSIT_AMOUNT}}` - Calculated deposit
- `{{BALANCE_AMOUNT}}` - Remaining balance

## 🐛 Troubleshooting

### PDF Generation Issues

**Problem**: PDF not generating
**Solution**: 
- Check console for errors
- Verify pdf-lib is installed: `npm list pdf-lib`
- Ensure contract object has all required fields

### API Connection Issues

**Problem**: API calls failing
**Solution**:
- Check API_BASE_URL in environment variables
- Verify backend is running
- Check browser console network tab for errors
- Ensure CORS is configured on backend

### Styling Issues

**Problem**: Components not styled correctly
**Solution**:
- Verify Tailwind CSS is configured
- Check that all Tailwind classes are in safelist
- Run `npm run build` to regenerate styles

## 📈 Future Enhancements

- [ ] Digital signature collection
- [ ] Contract version history
- [ ] Automated email reminders
- [ ] Payment integration
- [ ] Contract analytics dashboard
- [ ] Mobile app support
- [ ] Multi-language support
- [ ] Contract expiration notifications
- [ ] Batch contract generation
- [ ] Custom branding per template

## 📞 Support

For questions or issues:
- Review this documentation
- Check the inline code comments
- Refer to the project requirements document
- Contact the development team

## 📄 License

Proprietary - Goodhand Outback Experience

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Author**: Development Team
