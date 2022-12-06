import mongoose from "mongoose";

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});
const mongooseExport = mongoose.model("Employee", employeeSchema);

export { mongooseExport };
