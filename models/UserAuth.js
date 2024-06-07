import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import Roles from "./Roles.js";
import ModelHasRoles from "./ModelHasRoles.js";

class UserAuth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
UserAuth.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    user_type: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1
    },
    remember_token: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: db.RC.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: db.RC.literal('CURRENT_TIMESTAMP')
    }
}, {
    sequelize: db.RC,
    modelName: 'UserAuth',
    tableName: 'users',
    timestamps: false
});

UserAuth.belongsTo(ModelHasRoles, {
    foreignKey: "id",
    as: "role",
    sourceKey: "model_id"
})
UserAuth.belongsTo(Roles, {
    foreignKey: "user_type",
    as: "UserRoles"
})
// UserAuth.belongsTo(ModelHasRoles, {
//     foreignKey: "user_type",
//     as: "UserRoles"
// })

export default UserAuth;