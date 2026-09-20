import mongoose from "mongoose"

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      required: true
    },
    amenities: {
      type: [String],
      default: []
    },
    propertyType: {
      type: String,
      enum: [
        "Hotel",
        "Resort",
        "Villa",
        "Apartment",
        "Guest House",
        "Hostel"
      ],
      default: "Hotel"
    },
    checkInTime: {
      type: String,
      default: "12:00 PM"
    },
    checkOutTime: {
      type: String,
      default: "11:00 AM"
    },
    address: {
      type: String,
      default: ""
    },
    policies: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Hotel ||
  mongoose.model("Hotel", HotelSchema)