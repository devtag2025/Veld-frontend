# Contract Management API Reference

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints require authentication. Include JWT token in header:
```
Authorization: Bearer <token>
```

---

## Contracts

### Get All Contracts
Get a paginated list of contracts with optional filtering.

**Endpoint:** `GET /contracts`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| search | string | No | Search term (name, email, ID) |
| status | string | No | Filter by status |
| package | string | No | Filter by package type |
| startDate | date | No | Filter by hunt date range start |
| endDate | date | No | Filter by hunt date range end |

**Example Request:**
```javascript
GET /api/contracts?page=1&limit=10&status=signed&search=john
```

**Response:**
```json
{
  "success": true,
  "data": {
    "contracts": [
      {
        "id": "CON-2026-001",
        "hunterName": "John Smith",
        "email": "john@example.com",
        "phone": "+1 555-0123",
        "huntDate": "2026-05-15",
        "package": "Premium Package",
        "status": "signed",
        "totalAmount": 15000,
        "paidAmount": 7500,
        "createdAt": "2026-01-10T00:00:00Z",
        "updatedAt": "2026-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "itemsPerPage": 10
    }
  }
}
```

---

### Get Contract Statistics
Get overview statistics for contracts.

**Endpoint:** `GET /contracts/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 48,
    "signed": 32,
    "pending": 12,
    "expired": 4,
    "draft": 0,
    "cancelled": 0,
    "totalRevenue": 576000,
    "expectedRevenue": 144000
  }
}
```

---

### Get Single Contract
Get detailed information for a specific contract.

**Endpoint:** `GET /contracts/:id`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Contract ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "CON-2026-001",
    "hunterName": "John Smith",
    "email": "john@example.com",
    "phone": "+1 555-0123",
    "address": "123 Main St, City, State",
    "huntDate": "2026-05-15",
    "package": "Premium Package",
    "pickupPoint": "Darwin Airport",
    "pickupNotes": "Arriving at 2 PM",
    "charterOption": "helicopter-206",
    "firearmOption": "company",
    "trophyProcessing": true,
    "customNotes": "",
    "template": "default",
    "status": "signed",
    "totalAmount": 15000,
    "paidAmount": 7500,
    "signedAt": "2026-01-15T00:00:00Z",
    "createdAt": "2026-01-10T00:00:00Z",
    "updatedAt": "2026-01-15T00:00:00Z"
  }
}
```

---

### Create Contract
Create a new hunt contract.

**Endpoint:** `POST /contracts`

**Request Body:**
```json
{
  "hunterName": "John Smith",
  "email": "john@example.com",
  "phone": "+1 555-0123",
  "address": "123 Main St, City, State",
  "huntDate": "2026-05-15",
  "package": "premium",
  "pickupPoint": "Darwin Airport",
  "pickupNotes": "Arriving at 2 PM",
  "charterOption": "helicopter-206",
  "firearmOption": "company",
  "trophyProcessing": true,
  "customNotes": "Dietary restrictions: None",
  "template": "default"
}
```

**Validation Rules:**
- `hunterName`: Required, string, 2-100 characters
- `email`: Required, valid email format
- `phone`: Required, valid phone format
- `huntDate`: Required, valid future date
- `package`: Required, enum: ['standard', 'premium', 'custom']
- `firearmOption`: Required, enum: ['company', 'own']

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "CON-2026-002",
    "hunterName": "John Smith",
    // ... full contract object
  },
  "message": "Contract created successfully"
}
```

---

### Update Contract
Update an existing contract.

**Endpoint:** `PUT /contracts/:id`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Contract ID |

**Request Body:**
```json
{
  "hunterName": "John Smith Jr.",
  "status": "signed",
  "signedAt": "2026-01-20T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "CON-2026-001",
    // ... updated contract object
  },
  "message": "Contract updated successfully"
}
```

---

### Delete Contract
Delete a contract (soft delete recommended).

**Endpoint:** `DELETE /contracts/:id`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Contract ID |

**Response:**
```json
{
  "success": true,
  "message": "Contract deleted successfully"
}
```

---

### Send Contract Email
Send contract PDF via email to hunter.

**Endpoint:** `POST /contracts/:id/send-email`

**Request Body:**
```json
{
  "to": "john@example.com",
  "subject": "Your Hunt Contract - CON-2026-001",
  "message": "Please review and sign the attached contract.",
  "includePaymentInstructions": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contract sent successfully to john@example.com"
}
```

---

### Download Contract PDF
Generate and download contract as PDF.

**Endpoint:** `GET /contracts/:id/pdf`

**Response:**
- Content-Type: `application/pdf`
- Binary PDF data

---

### Bulk Actions
Perform bulk operations on multiple contracts.

**Endpoint:** `POST /contracts/bulk-action`

**Request Body:**
```json
{
  "action": "send-email",
  "contractIds": ["CON-2026-001", "CON-2026-002", "CON-2026-003"],
  "emailData": {
    "subject": "Your Hunt Contract",
    "message": "Please review your contract."
  }
}
```

**Available Actions:**
- `send-email`: Send emails to multiple hunters
- `delete`: Delete multiple contracts
- `download`: Generate ZIP of PDFs
- `update-status`: Update status for multiple contracts

**Response:**
```json
{
  "success": true,
  "data": {
    "successful": 3,
    "failed": 0,
    "results": [
      {
        "id": "CON-2026-001",
        "status": "success"
      },
      {
        "id": "CON-2026-002",
        "status": "success"
      }
    ]
  },
  "message": "Bulk action completed"
}
```

---

## Templates

### Get All Templates
Get list of contract templates.

**Endpoint:** `GET /contracts/templates`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "TPL-001",
      "name": "Default Hunt Contract",
      "description": "Standard contract for regular hunts",
      "version": "1.0",
      "isDefault": true,
      "usageCount": 45,
      "status": "active",
      "createdAt": "2026-01-01T00:00:00Z",
      "lastModified": "2026-01-15T00:00:00Z"
    }
  ]
}
```

---

### Get Single Template
Get detailed template information.

**Endpoint:** `GET /contracts/templates/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "TPL-001",
    "name": "Default Hunt Contract",
    "description": "Standard contract",
    "content": "Contract template with {{PLACEHOLDERS}}",
    "includePaymentTerms": true,
    "includeFirearmSection": true,
    "includeCharterSection": true,
    "includeTrophySection": true,
    "customSections": [],
    "version": "1.0",
    "isDefault": true
  }
}
```

---

### Create Template
Create a new contract template.

**Endpoint:** `POST /contracts/templates`

**Request Body:**
```json
{
  "name": "Premium Hunt Template",
  "description": "Template for premium package hunts",
  "content": "Contract content with {{HUNTER_NAME}}...",
  "includePaymentTerms": true,
  "includeFirearmSection": true,
  "includeCharterSection": true,
  "includeTrophySection": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "TPL-004",
    // ... template object
  },
  "message": "Template created successfully"
}
```

---

### Update Template
Update existing template.

**Endpoint:** `PUT /contracts/templates/:id`

**Request Body:**
```json
{
  "name": "Updated Template Name",
  "content": "Updated content..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // ... updated template
  },
  "message": "Template updated successfully"
}
```

---

### Delete Template
Delete a template (cannot delete default).

**Endpoint:** `DELETE /contracts/templates/:id`

**Response:**
```json
{
  "success": true,
  "message": "Template deleted successfully"
}
```

**Error Response (if default):**
```json
{
  "success": false,
  "error": "Cannot delete default template"
}
```

---

### Duplicate Template
Create a copy of an existing template.

**Endpoint:** `POST /contracts/templates/:id/duplicate`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "TPL-005",
    "name": "Default Hunt Contract (Copy)",
    // ... duplicated template
  },
  "message": "Template duplicated successfully"
}
```

---

### Set Default Template
Set a template as the default.

**Endpoint:** `PATCH /contracts/templates/:id/set-default`

**Response:**
```json
{
  "success": true,
  "message": "Template set as default successfully"
}
```

---

## Error Responses

All endpoints use consistent error response format:

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Contract not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes per IP
- **Email endpoints**: 10 requests per 15 minutes per IP
- **PDF generation**: 50 requests per 15 minutes per IP

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Webhooks (Optional)

Configure webhooks to receive real-time updates:

**Events:**
- `contract.created`
- `contract.updated`
- `contract.signed`
- `contract.deleted`
- `payment.received`

**Webhook Payload:**
```json
{
  "event": "contract.signed",
  "timestamp": "2026-01-15T10:30:00Z",
  "data": {
    "contractId": "CON-2026-001",
    "hunterName": "John Smith",
    "signedAt": "2026-01-15T10:30:00Z"
  }
}
```

---

## Testing

**Test Credentials:**
```
Username: admin@goodhandoutback.com
Password: test123
```

**Test Contract IDs:**
- `CON-TEST-001` - Draft contract
- `CON-TEST-002` - Signed contract
- `CON-TEST-003` - Expired contract

**Postman Collection:**
Available at: `/api/docs/postman-collection.json`

---

## Support

For API support:
- Email: dev@goodhandoutback.com
- Documentation: https://docs.goodhandoutback.com
- Status: https://status.goodhandoutback.com

---

**API Version:** 1.0  
**Last Updated:** February 2026  
**Base URL:** https://api.goodhandoutback.com/v1
