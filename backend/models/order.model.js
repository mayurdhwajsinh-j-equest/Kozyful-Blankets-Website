const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
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

module.exports = Order;