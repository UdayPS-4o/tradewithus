import { Request, Response, NextFunction } from 'express';

/**
 * Validates product data in the request body
 */
export const validateProductData = (req: Request, res: Response, next: NextFunction): void => {
  const { productId, productName, images, sellerId, price, details, shipping } = req.body;

  if (!productId || !productName || !images || !sellerId || !price || !details || !shipping) {
    res.status(400).json({
      success: false,
      message: 'Missing required product fields',
    });
    return;
  }

  // Validate price
  if (!price.current || !price.range || !price.range.min || !price.range.max) {
    res.status(400).json({
      success: false,
      message: 'Invalid price data',
    });
    return;
  }

  // Validate details
  if (
    !details.name ||
    !details.product ||
    !details.origin ||
    !details.productionCapacity ||
    !details.exportVolume ||
    !details.formAndCut ||
    !details.color ||
    !details.cultivationType
  ) {
    res.status(400).json({
      success: false,
      message: 'Invalid product details',
    });
    return;
  }

  // Validate shipping
  if (
    !shipping.hsCode ||
    !shipping.minQuantity ||
    !shipping.packaging ||
    !shipping.transportMode ||
    !shipping.incoterms ||
    !shipping.shelfLife
  ) {
    res.status(400).json({
      success: false,
      message: 'Invalid shipping details',
    });
    return;
  }

  next();
};

/**
 * Validates profile data in the request body
 */
export const validateProfileData = (req: Request, res: Response, next: NextFunction): void => {
  const { profileId, businessName, logo, businessOverview, businessType, established, address, owner } = req.body;

  if (!profileId || !businessName || !logo || !businessOverview || !businessType || !established || !address || !owner) {
    res.status(400).json({
      success: false,
      message: 'Missing required profile fields',
    });
    return;
  }

  next();
}; 