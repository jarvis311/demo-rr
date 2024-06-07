import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
import AffilationCityPinCode from "./AffilationCityPinCode.js";
  class AffilationState extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AffilationState.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    state: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
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
    modelName: 'AffilationState',
    tableName: 'affilation_state',
    timestamps: false
  });
  AffilationState.hasMany(AffilationCityPinCode, {
    as: 'get_citywise_pincode_Data',
    foreignKey: 'affilation_city_id'
  })
  export default AffilationState;