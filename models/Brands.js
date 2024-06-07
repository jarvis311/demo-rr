import {
  Model,
  DataTypes
} from "sequelize";
import db from '../config/database.js'

import Category from "./Categories.js"
import NewsHeadline from "./NewsHeadline.js";
import VehicleInformation from "./VehicleInformation.js";

class Brands extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // Brands.belongsTo(models.DrivingSchoolCity, {
    //   foreignKey: "city_id",
    // });
    // Brands.hasMany(models.DrivingSchoolCity, {
    //   foreignKey: "area_id",
    // });
  }
}
Brands.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
  },
  title: {
    type: DataTypes.STRING,
  },
  headtag: {
    type: DataTypes.TEXT,
  },
  test_drive_link: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
  is_popular: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  logo: {
    type: DataTypes.STRING,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  deleted_by: {
    type: DataTypes.INTEGER,
  },
  deleted_at: {
    type: DataTypes.DATE,
  },
}, {
  sequelize: db.Vehicle,
  modelName: 'Brands',
  tableName: 'brands',
  timestamps: false
});

Brands.hasOne(Category, {
  foreignKey: 'id',
  sourceKey: 'category_id',
  as: 'category'
})

Brands.hasMany(NewsHeadline, {
  as: 'newsVehicleBrands',
  foreignKey: 'brand_id'
});

// NewsHeadline Model
NewsHeadline.belongsTo(Brands, {
  as: 'newsVehicleBrands',
  foreignKey: 'brand_id'
});



Brands.hasMany(VehicleInformation, {
  as: 'BrandDeatils',
  foreignKey: 'brand_id'
});

// NewsHeadline Model
VehicleInformation.belongsTo(Brands, {
  as: 'BrandDeatils',
  foreignKey: 'brand_id'
});
export default Brands;