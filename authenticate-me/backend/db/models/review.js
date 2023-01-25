'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // One-To-Many Relationship between Users and Reviews
      Review.belongsTo(
        models.User,
        { foreignKey: 'userId' }
      )

      // One-To-Many Relationship between Spots and Reviews
      Review.belongsTo(
        models.Spot,
        { foreignKey: 'spotId' }
      )

      // One-To-Many Relationship between Reviews and ReviewImages
      Review.hasMany(
        models.ReviewImage,
        { foreignKey: 'reviewId', onDelete: 'CASCADE', hooks: true }
      )

    }

  }
  Review.init({
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    review: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stars: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};