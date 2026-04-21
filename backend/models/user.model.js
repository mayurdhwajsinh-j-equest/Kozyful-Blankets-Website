// backend/models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user', // all new signups are regular users
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
    User.hasMany(models.Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
  };

  return User;
};