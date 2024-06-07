import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'

class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
Roles.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    guard_name: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    }
}, {
    sequelize: db.RC,
    modelName: 'Roles',
    tableName: 'roles',
    timestamps: false
});
export default Roles;

