
import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import Feedback from "./Feedback.js";
class FeedbackImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  
}
FeedbackImage.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    feedback_id:{
        type: DataTypes.BIGINT,
        allowNull:false
    },
    image:{
        type: DataTypes.STRING,
        defaultValue: null
    },
    created_at: {
        type: DataTypes.DATE,
       defaultValue: DataTypes.NOW, 
    },
    updated_at: {
        type: DataTypes.DATE,
       defaultValue: DataTypes.NOW,
    },
   
}, {
    sequelize: db.RC,
    modelName: 'FeedbackImage',
    tableName: 'feedback_images',
    timestamps: false
});

FeedbackImage.belongsTo(Feedback,{
    as:"images",
    foreignKey:"feedback_id"
})
 
Feedback.hasMany(FeedbackImage,{
    as:"images",
    foreignKey:"feedback_id"
})

export default FeedbackImage;