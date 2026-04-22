const db = require('../models');
const { Product } = db;

const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, minPrice, maxPrice, isBestSeller, search } = req.query;
    const offset = (page - 1) * limit;

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

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [{
        model: db.Review,
        include: [{ model: db.User, attributes: ['id', 'name'] }],
        attributes: { exclude: ['updatedAt'] }
      }]
    });

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product fetched successfully', data: product });
  } catch (error) {
    next(error);
  }
};

// ── FIXED: reads image from req.file (multer), not req.body ──
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discountPrice, stock, category, isBestSeller } = req.body;

    const image = req.file
      ? `/uploads/products/${req.file.filename}`
      : null;

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice: discountPrice || null,
      stock: stock || 0,
      category,
      image,
      isBestSeller: isBestSeller || false,
      isActive: true
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error) {
    next(error);
  }
};

// ── FIXED: only updates image if new file uploaded ──
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    await product.update(updateData);
    res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    await product.destroy();
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getBestSellers = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const products = await Product.findAll({
      where: { isActive: true, isBestSeller: true },
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, message: 'Best sellers fetched successfully', data: products });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getBestSellers };