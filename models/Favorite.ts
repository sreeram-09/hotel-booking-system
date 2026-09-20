import mongoose from "mongoose"

const FavoriteSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true
  }
)

FavoriteSchema.index(
  {
    userId: 1,
    hotelId: 1
  },
  {
    unique: true
  }
)

export default mongoose.models.Favorite ||
  mongoose.model("Favorite", FavoriteSchema)