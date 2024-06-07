import {
    Model,
    DataTypes
  } from "sequelize";

  import db from '../config/database.js'
  class Offer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

  }
  Offer.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:''
    },
    lable: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:''
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:''
    },
    percentage: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:''
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:''
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:''
    },
    utm_term: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:''
    },
    color_code: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:''
    },
    image: {
        type: DataTypes.STRING,
    },
    action_button: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:''
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue:0
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
    }
  }, {
    sequelize:db.Vehicle,
    modelName: 'Offer',
    tableName: 'offers',
    timestamps: false
  });
  export default Offer;