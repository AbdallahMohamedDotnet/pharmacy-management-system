# Medicine Images

This directory contains placeholder images for medicines in the Pharmacy Management System.

## Image System

The application uses an intelligent image mapping system that:

1. **Checks API Response First**: If the medicine data from the API includes an `imageUrl`, it uses that.
2. **Falls Back to Smart Matching**: If no image URL is provided, it matches the medicine name or category to local SVG placeholders.
3. **Default Fallback**: If no match is found, it displays a generic medicine placeholder.

## Available Images

### Medicine-Specific Images
- `acetaminophen.svg` - Blue gradient with pill icon
- `ibuprofen.svg` - Red gradient with capsule icon
- `aspirin.svg` - Pink gradient with cross icon
- `amoxicillin.svg` - Green gradient with capsule icon
- `azithromycin.svg` - Teal gradient with capsule icon
- `vitamins.svg` - Purple gradient with multiple pills
- `cold-flu.svg` - Cyan gradient with medicine pack
- `allergy.svg` - Orange gradient with pills
- `digestive.svg` - Lime gradient with multiple pills
- `skincare.svg` - Pink gradient with cream container
- `first-aid.svg` - Red gradient with first aid cross
- `medicine-default.svg` - Gray gradient with checkmark

## How Images Are Selected

The system uses the following priority:

1. **Exact API Image URL**: Uses the `imageUrl` from the medicine data if available
2. **Medicine Name Match**: Searches for keywords in the medicine name (e.g., "acetaminophen", "ibuprofen")
3. **Category Match**: Matches the medicine category (e.g., "Pain Relief", "Antibiotics")
4. **Default Image**: Falls back to `medicine-default.svg`

## Adding More Images

To add new medicine images:

1. Create an SVG file in this directory with a descriptive name
2. Update `/lib/medicine-images.ts`:
   - Add the image path to `medicineImages` object for medicine-specific images
   - Add the image path to `categoryImages` object for category-based images

## Image Format

All images are SVG format (Scalable Vector Graphics) because they:
- Scale perfectly to any size
- Have small file sizes
- Look crisp on all devices
- Support gradients and custom colors

## Usage in Components

Images are automatically applied in:
- Medicine list pages (`/medicines`)
- Shop page (`/shop`)
- Product detail pages (`/product/[id]`)
- Featured products section
- Cart items

The `getMedicineImage()` function in `/lib/medicine-images.ts` handles all image resolution logic.

## Updating Medicine Images in the API

To use real product images, update your API backend to include image URLs:

```json
{
  "id": "guid",
  "name": "Acetaminophen 500mg",
  "imageUrl": "https://your-cdn.com/images/acetaminophen-500mg.jpg",
  ...
}
```

The frontend will automatically use these URLs when available.
