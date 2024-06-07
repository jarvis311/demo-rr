import {
    Model,
    DataTypes
  } from "sequelize";
import db from '../config/database.js'
import ResaleVehicleCompanyNew from "./ResaleVehicleCompanyNew.js"
import ResaleYearsNew from "./ResaleYearsNew.js";
// import ResaleVehicleCategory from "./ResaleVehicleCategory.js";
  class ResaleVehicleModelNew extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ResaleVehicleModelNew.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
      type: DataTypes.BIGINT,
      defaultValue:0
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    resale_vehicle_company_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_cron: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize: db.Vehicle,
    modelName: 'ResaleVehicleModelNew',
    tableName: 'resale_vehicle_model',
    timestamps: false
  });
  ResaleYearsNew.belongsTo(ResaleVehicleModelNew, {
    as: 'ResaleModelTrimData',
    foreignKey: 'resale_vehicle_model_id'
  })
  ResaleVehicleTrimNew.belongsTo(ResaleVehicleModelNew, {
    as: 'ResalePriceModelData',
    foreignKey: 'resale_vehicle_model_id'
  })
  export default ResaleVehicleModelNew;