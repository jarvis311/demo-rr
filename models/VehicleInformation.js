import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import VehicleInformationImages from './VehicleInformationImages.js'
import VehicleModelColor from './VehicleModelColor.js'
import PriceVariant from './PriceVariant.js'
import moment from "moment"
import Rescale from './Rescale.js'
import VehicleModelImage from "./VehicleModelImage.js";
import VariantKeySpecification from "./VariantKeySpecification.js";


class VehicleInformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
}
VehicleInformation.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    bodytype_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    bind_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    model_name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'NA'
    },
    fuel_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'NA'
    },
    avg_rating: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
    },
    review_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    variant_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    min_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    max_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    price_range: {
        type: DataTypes.STRING,
        allowNull: false
    },
    search_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    popular_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:"NA"
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    launched_at: {
        type: DataTypes.STRING,
    },
    Launch_date: {
        type: DataTypes.STRING,
    },
    model_popularity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue : 0
    },
    mileage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    engine: {
        type: DataTypes.STRING,
        allowNull: false
    },
    style_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:'NA'
    },
    max_power: {
        type: DataTypes.STRING,
        allowNull: false
    },
    showroom_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    rto_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    insurance_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue:0
    },
    other_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue:0
    },
    is_content_writer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    is_designer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    on_road_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    is_popular_search: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue:0
    },
    is_upcoming: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue:0
    },
    is_latest: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue:0
    },
    price_desc: {
        type: DataTypes.TEXT,
    },
    highlights_desc: {
        type: DataTypes.TEXT,
    },
    key_specs: {
        type: DataTypes.TEXT,
    },
    manufacturer_desc: {
        type: DataTypes.TEXT,
    },
    is_recommended: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    link: {
        type: DataTypes.STRING,
    },
    headtag: {
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
    }
}, {
    sequelize: db.Vehicle,
    modelName: 'VehicleInformation',
    tableName: 'vehicle_information',
    timestamps: false
});
VehicleInformation.hasMany(VehicleInformationImages, {
    as: 'vehicle_information_images',
    foreignKey: 'vehicle_information_id'
})
VehicleInformation.hasMany(VehicleModelColor, {
    as: 'vehicles_model_color',
    foreignKey: 'vehicle_information_id'
})
VehicleInformation.hasMany(PriceVariant, {
    as: 'vehicle_varint_price',
    foreignKey: 'vehicle_information_id'
})
VehicleInformation.hasMany(Rescale, {
    as: 'vehicle_year_rescale',
    foreignKey: 'vehicle_information_id'
})
VehicleInformation.hasMany(VehicleModelImage, {
    as: 'vehicle_model_images',
    foreignKey: 'vehicle_information_id'
})
VehicleInformation.hasMany(PriceVariant, {
    as: 'vehicle_price_variant',
    foreignKey: 'vehicle_information_id'
})
// addd by jignesh patel 22-11-'23
VehicleInformation.hasMany(VariantKeySpecification, {
    as: 'vehicleInformatiomDetails',
    foreignKey: 'vehicle_information_id'
})
VariantKeySpecification.belongsTo(VehicleInformation, {
    as: 'vehicleInformatiomDetails',
    foreignKey: 'vehicle_information_id'
})
VehicleInformation.hasMany(PriceVariant, {
    as: 'VehicleInformationDetails',
    foreignKey: 'vehicle_information_id'
})
PriceVariant.belongsTo(VehicleInformation, {
    as: 'VehicleInformationDetails',
    foreignKey: 'vehicle_information_id'
})
export default VehicleInformation