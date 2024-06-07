
import {
    Model,
    DataTypes,
} from "sequelize";
import db from '../config/database.js'
import moment from "moment"
import FuelState from "./FuelState.js";

class FuelPrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  
}
FuelPrice.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    main_id:{
        type: DataTypes.BIGINT,
        allowNull:false
    },
    company_id:{
        type: DataTypes.STRING,
    },
    state:{
        type: DataTypes.STRING,
        allowNull:false
    },
    city:{
        type: DataTypes.STRING,
        allowNull:false
    },
    petrol_price: {
        type: DataTypes.DOUBLE,
        allowNull:false,
        defaultValue : -1
    },
    extra_premium_petrol_price:{
        type: DataTypes.DOUBLE,
        allowNull:false,
        defaultValue : -1
    },
    petrol_diff:{
        type: DataTypes.DOUBLE,
        allowNull:false,
        defaultValue : -1
    },
    diesel_price:{
        type: DataTypes.DOUBLE,
        allowNull:false,
        defaultValue : -1
    },
    extra_premium_diesel_price:{
        type: DataTypes.DOUBLE,
        allowNull:false,
        defaultValue : -1
    },
    diesel_diff:{
        type: DataTypes.DOUBLE,
        allowNull:false,
        defaultValue : -1
    },
    cng_price:{
        type: DataTypes.DOUBLE,
        allowNull:false,
        defaultValue : -1
    },
    lpg_price:{
        type: DataTypes.DOUBLE,
        allowNull:false,
        defaultValue : -1
    },
    cng_diff:{
        type: DataTypes.DOUBLE,
        allowNull:false,
        defaultValue : 0
    },
    lpg_diff:{
        type: DataTypes.DOUBLE,
        allowNull:false,
        defaultValue : 0
    },
    date:{
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return this.getDataValue('created_at') ? moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss') : null ;
          }
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return this.getDataValue('updated_at') ? moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss') : null ;
          }
    }

}, {
    sequelize: db.Vehicle,
    modelName: 'FuelPrice',
    tableName: 'fuel_price',
    timestamps: false
});
 
export default FuelPrice;