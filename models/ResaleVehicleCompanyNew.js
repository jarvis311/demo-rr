import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  import ResaleVehicleModelNew from './ResaleVehicleModelNew.js'
  class ResaleVehicleCompanyNew extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ResaleVehicleCompanyNew.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    resale_vehicle_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize: db.Vehicle,
    modelName: 'ResaleVehicleCompanyNew',
    tableName: 'resale_vehicle_company',
    timestamps: false
  });

  ResaleVehicleModelNew.addScope('selection_condition', {
    attributes: [
        'id',
        ['id' ,'ModelID'],
        ['name','ModelName'],
        'resale_vehicle_company_id'
    ],
  });
  ResaleVehicleCompanyNew.hasMany(ResaleVehicleModelNew.scope('selection_condition'), {
    as: 'ModelData',
    foreignKey: 'resale_vehicle_company_id'
  })
  ResaleVehicleModelNew.belongsTo(ResaleVehicleCompanyNew, {
    as: 'get_company',
    foreignKey: 'resale_vehicle_company_id'
  })
  ResaleVehicleModelNew.belongsTo(ResaleVehicleCompanyNew, {
    as: 'ResaleModelYearData',
    foreignKey: 'resale_vehicle_company_id'
  })
  ResaleVehicleModelNew.belongsTo(ResaleVehicleCompanyNew, {
    as: 'ResaleCompanyTrimYearData',
    foreignKey: 'resale_vehicle_company_id'
  })
  ResaleVehicleModelNew.belongsTo(ResaleVehicleCompanyNew, {
    as: 'ResalePriceCompanyData',
    foreignKey: 'resale_vehicle_company_id'
  })
  export default ResaleVehicleCompanyNew;