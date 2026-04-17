module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    'Review',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      helpful: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      tableName: 'reviews',
      timestamps: true
    }
  );

  Review.associate = (models) => {
    Review.belongsTo(models.Product, {
      foreignKey: 'productId',
      onDelete: 'CASCADE'
    });
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return Review;
};