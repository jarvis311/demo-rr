import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import AffiliationServices from "./AffiliationServices.js";
import ServiceProvider from "./ServiceProvider.js";

class ServiceCityList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
ServiceCityList.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    affiliation_services_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    service_provider_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    city_id: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    pincode_id :{
        type: DataTypes.TEXT
    },
    language_key : {
        type: DataTypes.TEXT
    },
    // city_key : {
    //     type: DataTypes.TEXT
    // },
    deleted_by: {
        type: DataTypes.INTEGER,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    deleted_at: {
        type: DataTypes.INTEGER,
    },
}, {
    sequelize: db.Vehicle,
    modelName: 'ServiceCityList',
    tableName: 'service_city_list',
    timestamps: false
});
ServiceCityList.belongsTo(AffiliationServices,{
    foreignKey: 'affiliation_services_id',
    targetKey: 'id',
    as:'get_affiliation_services'
})
ServiceCityList.belongsTo(ServiceProvider,{
    foreignKey: 'service_provider_id',
    targetKey: 'id',
    as:'get_service_provider_name'
})
export default ServiceCityList;