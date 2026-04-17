module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
      },
      shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      trackingNumber: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      tableName: 'orders',
      timestamps: true
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      onDelete: 'CASCADE'
    });
  };

  return Order;
};