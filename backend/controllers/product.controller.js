const db = require('../models');
const { Product } = db;
const { Op } = db.Sequelize;

// ─────────────────────────────────────────────────────────────
// GET /products  — supports filters, sort, pagination, search
// ─────────────────────────────────────────────────────────────
const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      isBestSeller,
      search,
      // ── new filter params ──
      material,     // comma-separated: "Polyester,Fleece"
      pattern,      // comma-separated
      size,         // comma-separated  (matches inside sizes JSON — handled in JS after fetch for now)
      fill,         // comma-separated
      // ── sort ──
      sort,         // isBestSeller | priceAsc | priceDesc | nameAsc | nameDesc
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { isActive: true };

    // ── existing filters ──
    if (category) where.category = category;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (isBestSeller === 'true') where.isBestSeller = true;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    // ── new attribute filters (multi-value: "Polyester,Fleece") ──
    if (material) {
      const vals = material.split(',').map(v => v.trim()).filter(Boolean);
      if (vals.length === 1) where.material = vals[0];
      else where.material = { [Op.in]: vals };
    }

    if (pattern) {
      const vals = pattern.split(',').map(v => v.trim()).filter(Boolean);
      if (vals.length === 1) where.pattern = vals[0];
      else where.pattern = { [Op.in]: vals };
    }

    if (fill) {
      const vals = fill.split(',').map(v => v.trim()).filter(Boolean);
      if (vals.length === 1) where.fill = vals[0];
      else where.fill = { [Op.in]: vals };
    }

    // ── sort ──
    let order = [['createdAt', 'DESC']]; // default

    if (sort === 'isBestSeller') order = [['isBestSeller', 'DESC'], ['createdAt', 'DESC']];
    if (sort === 'priceAsc') order = [['price', 'ASC']];
    if (sort === 'priceDesc') order = [['price', 'DESC']];
    if (sort === 'nameAsc') order = [['name', 'ASC']];
    if (sort === 'nameDesc') order = [['name', 'DESC']];

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
    });

    // ── size filter — done in JS because sizes is a JSON column ──
    // (move to a separate SizeVariant table later for DB-level filtering)
    let filteredRows = rows;
    if (size) {
      const sizeVals = size.split(',').map(v => v.trim().toLowerCase()).filter(Boolean);
      filteredRows = rows.filter(product => {
        const sizes = product.sizes || [];
        return sizes.some(s => sizeVals.includes(s.label?.toLowerCase()));
      });
    }

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: filteredRows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /products/:id
// ─────────────────────────────────────────────────────────────
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [{
        model: db.Review,
        include: [{ model: db.User, attributes: ['id', 'name'] }],
        attributes: { exclude: ['updatedAt'] },
      }],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product fetched successfully', data: product });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /products  (admin)
// ─────────────────────────────────────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    const {
      name, description, price, discountPrice,
      stock, category, isBestSeller,
      // new fields
      material, pattern, fill,
      types, sizes,
      dispatchInfo, isCustomizable, klarnaEligible,
      images,
    } = req.body;

    // Main thumbnail — from multer or body
    const image = req.file
      ? `/uploads/products/${req.file.filename}`
      : req.body.image || null;

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice: discountPrice || null,
      stock: stock || 0,
      category,
      image,
      images: parseJSON(images, []),
      isBestSeller: isBestSeller === 'true' || isBestSeller === true || false,
      isActive: true,
      material: material || null,
      pattern: pattern || null,
      fill: fill || null,
      types: parseJSON(types, []),
      sizes: parseJSON(sizes, []),
      dispatchInfo: dispatchInfo || null,
      isCustomizable: isCustomizable === 'true' || isCustomizable === true || false,
      klarnaEligible: klarnaEligible === 'true' || klarnaEligible === true || false,
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /products/:id  (admin)
// ─────────────────────────────────────────────────────────────
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updateData = { ...req.body };

    // Handle image from req.files (upload.fields) instead of req.file
    if (req.files && req.files['image'] && req.files['image'][0]) {
      updateData.image = `/uploads/products/${req.files['image'][0].filename}`;
    }

    // Parse JSON fields
    ['images', 'types', 'sizes'].forEach(field => {
      if (typeof updateData[field] === 'string' && updateData[field].trim()) {
        updateData[field] = parseJSON(updateData[field], undefined);
      }
    });

    // Boolean coercion
    ['isBestSeller', 'isActive', 'isCustomizable', 'klarnaEligible'].forEach(field => {
      if (updateData[field] !== undefined) {
        updateData[field] = updateData[field] === 'true' || updateData[field] === true;
      }
    });

    await product.update(updateData);
    res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /products/:id  (admin)
// ─────────────────────────────────────────────────────────────
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await product.destroy();
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /products/bestsellers
// ─────────────────────────────────────────────────────────────
const getBestSellers = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const products = await Product.findAll({
      where: { isActive: true, isBestSeller: true },
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ success: true, message: 'Best sellers fetched successfully', data: products });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────
function parseJSON(value, fallback) {
  if (!value) return fallback;
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch { return fallback; }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getBestSellers,
};