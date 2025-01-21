import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  location: string;
  type: "full-time" | "part-time" | "contract";
  skills: string[];
  employer: mongoose.Types.ObjectId;
  applications: Array<{
    candidateId: mongoose.Types.ObjectId;
    resumeUrl: string;
    status: string;
    createdAt?: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract"],
      required: true,
    },
    skills: [{ type: String, required: true }],
    employer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    applications: [
      {
        candidateId: { type: Schema.Types.ObjectId, ref: "User" },
        resumeUrl: { type: String, required: true },
        status: {
          type: String,
          enum: [
            "applied",
            "under review",
            "interview scheduled",
            "rejected",
            "hired",
          ],
          default: "applied",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model<IJob>("Job", JobSchema);

export default Job;
