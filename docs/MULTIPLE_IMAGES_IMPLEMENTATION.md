# Multiple Product Images Implementation

## Overview
This document describes the implementation of multiple image support for products, allowing users to upload, manage, and display multiple images per product.

## Database Changes

### New Table: `product_images`
- **File**: `add-product-images-table.sql`
- Stores multiple images per product with:
  - `id`: UUID primary key
  - `product_id`: Foreign key to products table
  - `image_url`: URL of the image in Supabase Storage
  - `display_order`: Order for displaying images (0-based)
  - `is_primary`: Boolean flag for primary/featured image
  - `created_at` / `updated_at`: Timestamps

### Features
- **Primary Image**: Only one image can be marked as primary per product (enforced by database trigger)
- **Display Order**: Images can be reordered
- **RLS Policies**: Role-based access control for viewing, creating, updating, and deleting images
- **Migration**: Existing `image_url` from products table is automatically migrated to `product_images` as primary

## Component Changes

### 1. Multiple Image Upload Component
**File**: `src/components/multiple-image-upload.tsx`

**Features**:
- Drag & drop multiple images at once
- Grid display of uploaded images
- Set primary image (star icon)
- Remove images
- Reorder images (up/down arrows)
- Automatic primary image assignment (first uploaded image)
- Real-time preview during upload

**Usage**:
```tsx
<MultipleImageUpload
    productId={productId}
    onImagesChanged={() => {
        // Callback when images are added/removed/reordered
    }}
/>
```

### 2. Product Form Updates
**File**: `src/components/products/product-form.tsx`

- Replaced single `ImageUpload` with `MultipleImageUpload`
- Automatically syncs primary image to `products.image_url` for backward compatibility
- Works for both create and edit modes

### 3. Product Display Updates

#### Products Table
- Fetches `product_images` along with products
- Displays primary image (or first image) in table
- Falls back to `image_url` if no `product_images` exist

#### Product Detail Page
- Shows primary image as main display
- Shows thumbnail grid if multiple images exist
- Falls back to `image_url` for backward compatibility

#### Inventory Table
- Updated to fetch and display primary image from `product_images`

## Helper Functions

**File**: `src/lib/utils/product-images.ts`

- `getProductImageUrl()`: Gets primary image with fallback
- `getFirstProductImage()`: Gets first image from array

## Backward Compatibility

- Existing `image_url` field in `products` table is maintained
- Primary image is automatically synced to `image_url`
- All existing queries continue to work
- Migration script moves existing images to `product_images` table

## Storage

- Images are stored in Supabase Storage bucket: `product-images`
- Path format: `products/{productId}-{timestamp}.{ext}`
- Max file size: 5MB per image
- Supported formats: PNG, JPG, JPEG, WEBP

## User Workflow

1. **Create/Edit Product**:
   - Save product first (required for image upload)
   - Drag & drop or click to select multiple images
   - First image automatically becomes primary
   - Set different primary image by clicking star icon
   - Reorder images using up/down arrows
   - Remove images by clicking X button

2. **View Product**:
   - Primary image displayed prominently
   - Additional images shown as thumbnails (if multiple exist)
   - All product displays (tables, forms, detail pages) show primary image

## Database Migration

Run the migration script:
```sql
-- Execute: add-product-images-table.sql
```

This will:
1. Create `product_images` table
2. Set up RLS policies
3. Create trigger for single primary image enforcement
4. Migrate existing `image_url` values to `product_images`

## Security

- **View**: All authenticated users can view product images
- **Create**: Staff+ can upload images
- **Update/Delete**: Manager+ can modify/remove images
- Storage bucket has appropriate RLS policies

## Future Enhancements

Potential improvements:
- Image cropping/editing
- Image alt text/captions
- Bulk image operations
- Image optimization on upload
- Image lazy loading in galleries
