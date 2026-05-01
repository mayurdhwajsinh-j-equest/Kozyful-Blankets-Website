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

      // ── Main image (kept for backward compat / card thumbnail) ──
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },

      // ── Gallery: array of image URLs for PDP slider ──
      images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
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
      },

      // ── Filter attributes ──
      material: {
        type: DataTypes.ENUM(
          'Cotton', 'Wool', 'Fleece', 'Down',
          'Polyester', 'Silk', 'Cashmere'
        ),
        allowNull: true
      },
      pattern: {
        type: DataTypes.STRING(50),  // e.g. 'Solid', 'Striped', 'Plaid'
        allowNull: true
      },
      fill: {
        type: DataTypes.STRING(50),  // e.g. 'SpiderMan', 'Plain', 'Custom'
        allowNull: true
      },

      // ── PDP: type variants (e.g. Sherpa fleece / Fleece) ──
      // Stored as JSON array: [{ label: 'Fleece', value: 'fleece' }, ...]
      types: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },

      // ── PDP: size variants with dimensions and per-size pricing ──
      // [{ label: 'Small', dimensions: '48cm*78cm', price: 12.99, discountPrice: 9.99 }, ...]
      sizes: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },

      // ── PDP: dispatch / delivery info ──
      dispatchInfo: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      // ── PDP: customisation flag ──
      isCustomizable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      // ── PDP: Klarna eligible ──
      klarnaEligible: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
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