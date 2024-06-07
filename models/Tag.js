import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tag.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
  }, {
    sequelize: db.Vehicle,
    modelName: 'Tag',
    tableName: 'tags',
    timestamps: false
  });
  export default Tag;

