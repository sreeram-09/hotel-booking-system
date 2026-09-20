import mongoose from "mongoose"

const PaymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    method: {
      type: String,
      enum: [
        "card",
        "upi",
        "netbanking",
        "pay_at_hotel"
      ],
      required: true
    },
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: [
        "pending",
        "successful",
        "failed",
        "refunded"
      ],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema)