import mongoose from "mongoose"

const RoomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true
    },
    roomNumber: {
      type: String,
      required: true
    },
    roomType: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["available", "booked"],
      default: "available"
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Room ||
  mongoose.model("Room", RoomSchema)