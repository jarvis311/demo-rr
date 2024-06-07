import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import KeySpecification from './KeySpecification.js'
import moment from "moment/moment.js";
class UserVehicleDocument extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
UserVehicleDocument.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    vehicle_number	: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reminder_key: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:'0'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    count:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:'0'
    },
    date:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    sequelize: db.Vehicle,
    modelName: 'UserVehicleDocument',
    tableName: 'user_vehicle_document',
    timestamps: false
});

export default UserVehicleDocument;