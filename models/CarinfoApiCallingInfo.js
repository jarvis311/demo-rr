import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  
  class CarinfoApiCallingInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CarinfoApiCallingInfo.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.STRING,
    },
    rto_to_carinfo_success: {
        type: DataTypes.INTEGER,
    },
    rto_to_carinfo_fail: {
        type: DataTypes.INTEGER,
    },
    type: {
        type: DataTypes.TINYINT,
    },
    carinfo_to_rto_success: {
        type: DataTypes.INTEGER,
    },
    carinfo_to_rto_fail: {
        type: DataTypes.INTEGER,
    }
  }, {
    sequelize:db.RC,
    modelName: 'CarinfoApiCallingInfo',
    tableName: 'carinfo_api_calling_info',
    timestamps: false
  });
  export default CarinfoApiCallingInfo;