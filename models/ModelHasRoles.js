import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import Roles from "./Roles.js";

class ModelHasRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
ModelHasRoles.init({
    // id: {
    //     type: DataTypes.BIGINT,
    //     primaryKey: true,
    //     autoIncrement: true,
    // },
    role_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    model_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    }
}, {
    sequelize: db.RC,
    modelName: 'ModelHasRoles',
    tableName: 'model_has_roles',
    timestamps: false
});
export default ModelHasRoles;

ModelHasRoles.belongsTo(Roles, {
    foreignKey: "role_id",
    as: "RoleName"
})