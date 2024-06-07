import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class AffiliationServices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AffiliationServices.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    services: {
      type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue : 0
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
  }, {
    sequelize:db.Vehicle,
    modelName: 'AffiliationServices',
    tableName: 'affiliation_services',
    timestamps: false
  });
  export default AffiliationServices;