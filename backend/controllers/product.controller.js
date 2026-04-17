const db = require('../models');

const { Product } = db;

/**
 * Get all products with pagination and filters
 * GET /api/products?page=1&limit=10&category=bedroom&minPrice=10&maxPrice=100
 */
const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, minPrice, maxPrice, isBestSeller, search } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const where = { isActive: true };
    if (category) where.category = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[db.Sequelize.Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[db.Sequelize.Op.lte] = parseFloat(maxPrice);
    }
    if (isBestSeller === 'true') where.isBestSeller = true;
    if (search) {
      where[db.Sequelize.Op.or] = [
        { name: { [db.Sequelize.Op.like]: `%${search}%` } },
        { description: { [db.Sequelize.Op.like]: `%${search}%` } }
      ];
    }

    // Fetch products
    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by ID with reviews
 * GET /api/products/:id
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: db.Review,
          include: [{ model: db.User, attributes: ['id', 'name'] }],
          attributes: { exclude: ['updatedAt'] }
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create product (admin only)
 * POST /api/products
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discountPrice, stock, category, image, isBestSeller } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      stock,
      category,
      image,
      isBestSeller: isBestSeller || false,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product (admin only)
 * PUT /api/products/:id
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product (admin only)
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get best sellers
 * GET /api/products/bestsellers
 */
const getBestSellers = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.findAll({
      where: { 
        isActive: true,
        isBestSeller: true
      },
      limit: parseInt(limit),
      order: [['rating', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Best sellers fetched successfully',
      data: products
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getBestSellers
};
