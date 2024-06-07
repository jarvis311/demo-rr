import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import moment from "moment"

class VehicleModelImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
VehicleModelImage.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    vehicle_information_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    color_id: {
        type: DataTypes.INTEGER,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:''
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:''
    },
    video: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:''
    },
    created_at: {
        type: DataTypes.DATE,
        get() {
            return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    updated_at: {
        type: DataTypes.DATE,
        get() {
            return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
          }
    }
}, {
    sequelize: db.Vehicle,
    modelName: 'VehicleModelImage',
    tableName: 'vehicle_model_image',
    timestamps: false
});
export default VehicleModelImage;