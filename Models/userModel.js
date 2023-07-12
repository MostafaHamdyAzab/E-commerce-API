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
  },
  { timestamps: true }
);

const setIamgeUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.image}`;
    doc.profileImage = imageUrl;
  }
};

userSchema.post("init", function (doc) {
  //this call after doc is intialized in db 'call in select'
  setIamgeUrl(doc);
});

userSchema.post("save", function (doc) {
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
