module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      discountPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      category: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      isBestSeller: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'products',
      timestamps: true
    }
  );

  Product.associate = (models) => {
    Product.hasMany(models.Review, {
      foreignKey: 'productId',
      onDelete: 'CASCADE'
    });
    Product.hasMany(models.OrderItem, {
      foreignKey: 'productId',
      onDelete: 'CASCADE'
    });
  };

  return Product;
};