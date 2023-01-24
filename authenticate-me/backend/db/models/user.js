'use strict';

const bcrypt = require('bcryptjs')


const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    // This method will return an object with only the User instance information that is safe to save to a a JWT
    toSafeObject(){
      const { id, username, email } = this
      return { id, username, email }
    }

    // This method will validate a password
    validatePassword(password){
      return bcrypt.compareSync(password, this.hashedPassword.toString())
    }

    // This static method returns a User with a particular id
    static getCurrentUserById(id){
      return User.scope('currentUser').findByPk(id)
    }

    // This static method will search for one User with the specified credential
    static async login({ credential, password }){
      const { Op } = require('sequelize')

      const user = await User.scope('authentication').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      })

      if(user && user.validatePassword(password)){
        return await User.scope('currentUser').findByPk(user.id)
      }
    }

    // This static method will sign up a user
    static async signup({ firstName, lastName, username, email, password }){
      const hashedPassword = bcrypt.hashSync(password)
      const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        hashedPassword
      })
      return await User.scope('currentUser').findByPk(user.id)
    }


    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value){
          if(value.includes('@')){
            throw new Error('Cannot be an email.')
          }
        }
        }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      currentUser: {
        attributes: {
          exclude: ['hashedPassword']
        }
      },
      authentication: {
        attributes: {}
      }
    }
  });
  return User;
};