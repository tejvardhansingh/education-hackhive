import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema(
  {
    userKey: { type: String, required: true }, // stable user identifier (email, id, sub)
    courseTitle: { type: String, required: true },
    progressPct: { type: Number, default: 0, min: 0, max: 100 },
    completedLessonIds: { type: [Number], default: [] },
  },
  { timestamps: true }
);

ProgressSchema.index({ userKey: 1, courseTitle: 1 }, { unique: true });

const Progress = mongoose.model('Progress', ProgressSchema);
export default Progress;
