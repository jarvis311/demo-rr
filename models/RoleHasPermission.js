import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import UserPermission from "./Permission.js";
import Roles from "./Roles.js";

class RoleHasPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
RoleHasPermission.init({
    permission_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
    },
    role_id: {
        type: DataTypes.BIGINT,
    }
}, {
    sequelize: db.RC,
    modelName: 'RoleHasPermission',
    tableName: 'role_has_permissions',
    timestamps: false
});
export default RoleHasPermission;

RoleHasPermission.belongsTo(UserPermission, {
    as: 'UserHasPermission',
    targetKey: 'id',
    foreignKey: {
        name: 'permission_id',
        primaryKey: true,
    },
})
RoleHasPermission.belongsTo(Roles, {
    as: 'UserHasRole',
    targetKey: 'id',
    foreignKey: {
        name: 'role_id',
        // primaryKey: true,
    },
})
