import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import moment from "moment"
import VariantKeySpecification from "./VariantKeySpecification.js";

class PriceVariant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
}
PriceVariant.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    vehicle_information_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:'NA'
    },
    link: {
        type: DataTypes.STRING,
    },
    engine : {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:'NA'
    },
    price_range: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:'NA'
    },
    price:{
        type: DataTypes.STRING,
    },
    review_count:{
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue:0
    },
    rating:{
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue:0
    },
    status:{
        type: DataTypes.STRING,
    },
    fuel_type:{
        type: DataTypes.STRING,
    },
    ex_show_room_rice:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    mileage:{
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue:0
    },
    rto_price:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    insurance_price:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    other_price:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    on_road_price:{
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue:0
    },
    latest_update:{
        type: DataTypes.TEXT,
    },
    is_scrapping:{
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue:0
    },
    launched_at:{
        type: DataTypes.STRING,
    },
    image:{
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    deleted_at: {
        type: DataTypes.DATE,
    },
    deleted_by: {
        type: DataTypes.INTEGER,
    },
}, {
    sequelize: db.Vehicle,
    modelName: 'PriceVariant',
    tableName: 'vehicle_price_variant',
    timestamps: false
});

PriceVariant.hasMany(VariantKeySpecification, {
    as: 'PriceVariantDetails',
    foreignKey: 'variant_id'
})
VariantKeySpecification.belongsTo(PriceVariant, {
    as: 'PriceVariantDetails',
    foreignKey: 'variant_id'
})
export default PriceVariant;
