-- Add content_image type to project_asset_type enum
-- This separates CMS content images from reference screenshots

ALTER TYPE project_asset_type ADD VALUE IF NOT EXISTS 'content_image';
