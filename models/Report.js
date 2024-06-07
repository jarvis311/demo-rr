import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
Report.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    reg_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fcm_token: {
        type: DataTypes.STRING,
        // allowNull: true
        defaultValue: "NA"
    },
    report: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    language_key: {
        type: DataTypes.STRING,
        // allowNull: false
        defaultValue: "en"
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
    deleted_at: {
        type: DataTypes.DATE,
    },
}, {
    sequelize: db.RC,
    modelName: 'Report',
    tableName: 'reports',
    timestamps: false
});
export default Report;

