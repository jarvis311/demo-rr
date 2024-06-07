import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
class UserPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
UserPermission.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    display_name: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
    },
    guard_name: {
        type: DataTypes.STRING,
        defaultValue: 'web'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
    },
    // deletedAt: {
    //     type: DataTypes.DATE,
    // }
}, {
    sequelize: db.RC,
    modelName: 'UserPermission',
    tableName: 'permissions',
    timestamps: false,
    // paranoid: true
});
export default UserPermission;

// UserPermission.belongsTo(ROle, {
//     as: 'UserHasRole',
//     foreignKey:
// })

