import mongoose from "mongoose"

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5
    },
    locationRating: {
      type: Number,
      min: 1,
      max: 5
    },
    service: {
      type: Number,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Review ||
  mongoose.model("Review", ReviewSchema)