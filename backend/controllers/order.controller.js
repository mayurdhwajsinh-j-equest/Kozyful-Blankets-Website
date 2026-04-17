const db = require('../models');

const { Order, OrderItem, Product, User } = db;

/**
 * Create order
 * POST /api/orders
 */
const createOrder = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { totalAmount, shippingAddress, paymentMethod, items } = req.body;
    const userId = req.userId;

    // Validate items and check stock
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      if (product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }
    }

    // Create order
    const order = await Order.create(
      {
        userId,
        totalAmount,
        shippingAddress,
        paymentMethod: paymentMethod || 'pending',
        status: 'pending'
      },
      { transaction }
    );

    // Create order items and update product stock
    for (const item of items) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        },
        { transaction }
      );

      // Update product stock
      const product = await Product.findByPk(item.productId, { transaction });
      await product.update(
        { stock: product.stock - item.quantity },
        { transaction }
      );
    }

    await transaction.commit();

    const createdOrder = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: createdOrder
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Get all orders for user
 * GET /api/orders
 */
const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const where = { userId };
    if (status) where.status = status;

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
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
 * Get all orders (admin only)
 * GET /api/orders/admin/all
 */
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
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
 * Get order by ID
 * GET /api/orders/:id
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const order = await Order.findByPk(id, {
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization - users can only view their own orders
    if (order.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status (admin only)
 * PUT /api/orders/:id
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    await order.update(updateData);

    const updatedOrder = await Order.findByPk(id, {
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel order
 * PUT /api/orders/:id/cancel
 */
const cancelOrder = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;
    const userId = req.userId;

    const order = await Order.findByPk(id, { transaction });
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.userId !== userId) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Can only cancel pending or processing orders
    if (!['pending', 'processing'].includes(order.status)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`
      });
    }

    // Restore product stock
    const orderItems = await OrderItem.findAll({ where: { orderId: id }, transaction });
    for (const item of orderItems) {
      const product = await Product.findByPk(item.productId, { transaction });
      await product.update(
        { stock: product.stock + item.quantity },
        { transaction }
      );
    }

    // Update order status
    await order.update({ status: 'cancelled' }, { transaction });

    await transaction.commit();

    const cancelledOrder = await Order.findByPk(id, {
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: cancelledOrder
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
