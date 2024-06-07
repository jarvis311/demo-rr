
import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  
}
Feedback.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    review:{
        type: DataTypes.STRING,
        defaultValue: null
    },
    ratings:{
        type: DataTypes.STRING,
        defaultValue: null
    },
    version_code:{
        type: DataTypes.STRING,
        defaultValue: null
    },
    version_name:{
        type: DataTypes.STRING,
        defaultValue: null
    },
    contact_information:{
        type: DataTypes.STRING,
    },
    status:{
        type:DataTypes.TINYINT,
        defaultValue:1
    },
    created_at: {
        type: DataTypes.DATE,
       defaultValue: DataTypes.NOW, 
    },
    updated_at: {
        type: DataTypes.DATE,
       defaultValue: DataTypes.NOW,
    },
    deleted_at: {
        type: DataTypes.STRING,
        defaultValue: null
    }
}, {
    sequelize: db.RC,
    modelName: 'Feedback',
    tableName: 'feedback',
    timestamps: false
});
 


export default Feedback;