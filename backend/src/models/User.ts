import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Interface để hỗ trợ TypeScript
export interface IUser extends Document {
  username: string;
  email: string;
  password?: string; // Sẽ không được trả về trong query thông thường
  roles: ("admin" | "moderator" | "user")[];
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    roles: {
      type: [String],
      enum: ["admin", "moderator", "user"],
      default: ["user"],
    },
  },
  { timestamps: true }
);

// Middleware: Hash password trước khi lưu
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method: So sánh mật khẩu đã hash
userSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password || "");
};

export const User = model<IUser>("User", userSchema);
