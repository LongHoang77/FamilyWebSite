import { Schema, model, Document, Types } from "mongoose";

export interface INavigationItem extends Document {
  label: string;
  path: string;
  icon?: string;
  type: "navbar" | "sidebar";
  roles: ("admin" | "moderator" | "user")[];
  parent?: Types.ObjectId | null;
  order: number;
}

const navigationItemSchema = new Schema<INavigationItem>(
  {
    label: { type: String, required: true },
    path: { type: String, required: true },
    icon: { type: String },
    type: {
      type: String,
      enum: ["navbar", "sidebar"],
      required: true,
    },
    roles: {
      type: [String],
      enum: ["admin", "moderator", "user"],
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "NavigationItem",
      default: null,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
);

export const NavigationItem = model<INavigationItem>(
  "NavigationItem",
  navigationItemSchema
);
