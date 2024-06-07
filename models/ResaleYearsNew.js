import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  import ResaleVehicleTrimNew from "./ResaleVehicleTrimNew.js"
  class ResaleYearsNew extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  ResaleYearsNew.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    resale_vehicle_model_id	: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
  }, {
    sequelize:db.Vehicle,
    modelName: 'ResaleYears',
    tableName: 'resale_years',
    timestamps: false
  });
  ResaleYearsNew.hasMany(ResaleVehicleTrimNew, {
    as: 'TrimData',
    foreignKey: 'resale_year_id'
  })
  ResaleVehicleTrimNew.belongsTo(ResaleYearsNew, {
    as: 'ResalePriceYearData',
    foreignKey: 'resale_year_id'
  })
  export default ResaleYearsNew;