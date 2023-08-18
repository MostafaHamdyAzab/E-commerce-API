const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      required: [true, "userName is Required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email Is Required"],
      lowercase: true,
    },
    password: {
      type: String,
      minlength: [3, "Too Short Password"],
      required: [true, "Password Is Required"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpire: Date,
    passwordResetVerified: Boolean,
    phone: String,
    profileImage: String,
    role: {
      type: String,
      enun: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: String,
      default: true,
    },
    //child ref (one to many)
    wishList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: mongoose.Schema.Types.ObjectId,
        alias: {
          type: String,
          unique: true,
          required: [true, "alias Is Required"],
        },
        postalCode: Number,
        phone: String,
        city: String,
        details: String,
      },
    ],
  }, //end userSchema

  { timestamps: true }
);

const setIamgeUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.image}`;
    doc.profileImage = imageUrl;
  }
};

userSchema.post("init", (doc) => {
  //this call after doc is intialized in db 'call in select'
  setIamgeUrl(doc);
});

userSchema.post("save", (doc) => {
  setIamgeUrl(doc);
});

//hashing password
userSchema.pre("save", async function (nxt) {
  if (!this.isModified("password")) return nxt();
  this.password = await bcrypt.hash(this.password, 12);
  nxt();
});

const user = mongoose.model("user", userSchema);
module.exports = user;
