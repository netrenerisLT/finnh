import mongoose from "mongoose";

const Schema = mongoose.Schema({
  searchInput: String,
  dateFrom: String,
  dateTo: String,
  company: String,
  stockPrice: [],
});

const Activity = mongoose.model("activity", Schema);

export default Activity;
