const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: [true, "Owner address is required"],
    validate: {
      validator: function(v) {
        return v.startsWith('0x') && v.length === 66;
      },
      message: props => `${props.value} is not a valid Aptos address!`
    }
  },
  tokenId: {
    type: String,
    required: [true, "Token ID is required"],
    unique: true
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [100, "Name cannot exceed 100 characters"]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [10, "Description must be at least 10 characters long"],
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  rentAmount: {
    type: Number,
    required: [true, "Rent amount is required"],
    min: [0, "Rent amount cannot be negative"]
  },
  deposit: {
    type: Number,
    required: [true, "Deposit amount is required"],
    min: [0, "Deposit amount cannot be negative"],
    validate: {
      validator: function(v) {
        return v <= this.rentAmount;
      },
      message: "Deposit amount cannot be greater than rent amount"
    }
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ['Electronics', 'Fashion', 'Home', 'Sports', 'Other']
  },
  condition: {
    type: String,
    required: [true, "Condition is required"],
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true
  },
  availableQuantity: {
    type: Number,
    required: [true, "Available quantity is required"],
    min: [0, "Available quantity cannot be negative"]
  },
  image: {
    type: String,
    required: [true, "Image is required"],
    validate: {
      validator: function(v) {
        return v.match(/\.(jpg|jpeg|png|gif)$/i);
      },
      message: "Invalid image format. Supported formats: jpg, jpeg, png, gif"
    }
  },
  blockchainTxHash: {
    type: String,
    required: [true, "Blockchain transaction hash is required"]
  },
  status: {
    type: String,
    enum: ['Created', 'Rented', 'Completed', 'Cancelled'],
    default: 'Created'
  },
  rentals: [{
    renter: {
      type: String,
      required: [true, "Renter address is required"],
      validate: {
        validator: function(v) {
          return v.startsWith('0x') && v.length === 66;
        },
        message: props => `${props.value} is not a valid Aptos address!`
      }
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"]
    },
    endDate: {
      type: Date,
      validate: {
        validator: function(v) {
          return !v || v > this.startDate;
        },
        message: "End date must be after start date"
      }
    },
    otp: {
      type: String,
      minlength: [6, "OTP must be 6 digits"],
      maxlength: [6, "OTP must be 6 digits"]
    },
    paymentTxHash: String,
    agreementTxHash: String,
    refundTxHash: String,
    completeTxHash: String,
    penalties: {
      type: Number,
      default: 0,
      min: [0, "Penalties cannot be negative"]
    },
    penaltyTxHash: String,
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Completed', 'Cancelled'],
      default: 'Pending'
    }
  }],
  totalRentals: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, "Rating cannot be negative"],
    max: [5, "Rating cannot exceed 5"]
  },
  reviews: [{
    user: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for frequently queried fields
rentalSchema.index({ owner: 1 });
rentalSchema.index({ category: 1 });
rentalSchema.index({ status: 1 });
rentalSchema.index({ "rentals.renter": 1 });
rentalSchema.index({ "rentals.status": 1 });

// Virtual for rental status
rentalSchema.virtual("isAvailable").get(function() {
  return this.status === 'Created' && this.availableQuantity > 0;
});

// Virtual for total revenue
rentalSchema.virtual("totalRevenue").get(function() {
  return this.rentals.reduce((total, rental) => {
    if (rental.status === 'Completed') {
      return total + this.rentAmount;
    }
    return total;
  }, 0);
});

// Pre-save middleware to update total rentals
rentalSchema.pre("save", function(next) {
  this.totalRentals = this.rentals.length;
  next();
});

// Method to calculate penalties
rentalSchema.methods.calculatePenalties = function(rentalId) {
  const rental = this.rentals.id(rentalId);
  if (!rental) return 0;

  if (!rental.endDate) return 0;

  const now = new Date();
  const endDate = new Date(rental.endDate);
  
  if (now > endDate) {
    const daysLate = Math.ceil((now - endDate) / (1000 * 60 * 60 * 24));
    return daysLate * (this.rentAmount * 0.1); // 10% of rent amount per day
  }

  return 0;
};

// Method to update average rating
rentalSchema.methods.updateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    return;
  }

  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.averageRating = totalRating / this.reviews.length;
};

const Rental = mongoose.model("Rental", rentalSchema);

module.exports = Rental;
