import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class AffilationCityPinCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AffilationCityPinCode.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    affilation_city_id : {
      type: DataTypes.INTEGER,
    },
    area: {
      type: DataTypes.STRING,
    },
    pincode: {
      type: DataTypes.STRING,
    },
    status : {
      type :DataTypes.TINYINT,
      defaultValue : 1
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deleted_at: {
        type: DataTypes.DATE,
    },
    deleted_by: {
        type: DataTypes.INTEGER,
    },
  }, {
    sequelize:db.Vehicle,
    modelName: 'AffilationCityPinCode',
    tableName: 'affilation_city_pincode',
    timestamps: false
  });


  export default AffilationCityPinCode;