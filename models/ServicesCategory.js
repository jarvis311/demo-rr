import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class ServicesCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

  }
  ServicesCategory.init({
    id : {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue : 0
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue : 0
    },
    position :{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue : 0
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }, deleted_at: {
        type: DataTypes.DATE,
    }
  }, {
    sequelize:db.Vehicle,
    modelName: 'ServicesCategory',
    tableName: 'service_category',
    timestamps: false
  });
  export default ServicesCategory;