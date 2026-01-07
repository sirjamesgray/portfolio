-- Migrate existing content images to use the new type
-- Content images are those with title 'Content Image' from CMS uploads

UPDATE project_assets
SET type = 'content_image'::project_asset_type
WHERE type = 'image' AND title = 'Content Image';
