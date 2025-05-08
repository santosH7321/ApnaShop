import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name: {
        tpye: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    category: [
        {
            tpye: mongoose.Schema.ObjectId,
            ref: "category"
        }
    ]
},{timestamps: true
})

const SubCategoryModel = mongoose.model('subCategory', subCategorySchema);
export default SubCategoryModel;