import { Model, DataTypes } from "sequelize";

import db from "../config/database.js";
class UserFcmToken extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // add associate here
  }
}

UserFcmToken.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    fcm_token: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    sequelize: db.Vehicle,
    modelName: "UserFcmToken",
    tableName: "user_fcm_token",
    timestamps: false,
  }
);

export default UserFcmToken;
