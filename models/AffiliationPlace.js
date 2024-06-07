import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class AffiliationPlace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

  }
  AffiliationPlace.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    place: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
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
    }
  }, {
    sequelize:db.Vehicle,
    modelName: 'AffiliationPlace',
    tableName: 'affiliation_place',
    timestamps: false
  });
  export default AffiliationPlace;