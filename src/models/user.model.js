const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    fullName: {
      type: String,
      trim: true,
      default: "",
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    nickname: {
      type: String,
      trim: true,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    firstName: {
      type: String,
      trim: true,
      default: "",
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    fcmToken: {
      type: String,
      default: "",
    },
    accountSetup: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.password;
        if (!ret.imageUrl && ret.profileImage) ret.imageUrl = ret.profileImage;
        if (!ret.profileImage && ret.imageUrl) ret.profileImage = ret.imageUrl;
        if (!ret.fullName && ret.name) ret.fullName = ret.name;
        if (!ret.name && ret.fullName) ret.name = ret.fullName;
        return ret;
      },
    },
  }
);

// Pre-save hook to hash password and harmonize names/images
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }

  // Sync fullName & name
  if (this.fullName && !this.name) this.name = this.fullName;
  if (this.name && !this.fullName) this.fullName = this.name;
  if (!this.fullName && (this.firstName || this.lastName)) {
    this.fullName = ((this.firstName || "") + " " + (this.lastName || "")).trim();
    this.name = this.fullName;
  }

  // Sync imageUrl & profileImage
  if (this.imageUrl && !this.profileImage) this.profileImage = this.imageUrl;
  if (this.profileImage && !this.imageUrl) this.imageUrl = this.profileImage;

  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
