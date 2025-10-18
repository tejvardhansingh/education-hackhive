import Progress from '../models/Progress.js';

// Extract a stable userKey from token
const getUserKey = (user) => {
  if (!user) return null;
  // common flat fields
  const flat = user.email || user.id || user._id || user.userId || user.sub;
  if (flat) return String(flat);
  // nested under user
  const nested = user.user?.email || user.user?.id || user.user?._id || user.user?.userId;
  if (nested) return String(nested);
  // nested under payload
  const payload = user.payload?.email || user.payload?.sub || user.payload?.id || user.payload?._id;
  if (payload) return String(payload);
  // fallback stringifiable
  return typeof user === 'string' ? user : null;
};

export const listMyProgress = async (req, res) => {
  try {
    const userKey = getUserKey(req.user);
    if (!userKey) return res.status(401).json({ message: 'Unauthorized' });

    const items = await Progress.find({ userKey }).lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load progress' });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const userKey = getUserKey(req.user);
    if (!userKey) return res.status(401).json({ message: 'Unauthorized' });
    const { courseTitle } = req.params;

    const item = await Progress.findOne({ userKey, courseTitle }).lean();
    if (!item) return res.status(404).json({ message: 'Not started' });

    res.json(item);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load course progress' });
  }
};

export const startCourse = async (req, res) => {
  try {
    const userKey = getUserKey(req.user);
    if (!userKey) return res.status(401).json({ message: 'Unauthorized' });
    const { courseTitle } = req.body;
    if (!courseTitle) return res.status(400).json({ message: 'courseTitle required' });

    const existing = await Progress.findOne({ userKey, courseTitle });
    if (existing) return res.json(existing);

    const created = await Progress.create({ userKey, courseTitle, progressPct: 0, completedLessonIds: [] });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ message: 'Failed to start course' });
  }
};

export const updateCourseProgress = async (req, res) => {
  try {
    const userKey = getUserKey(req.user);
    if (!userKey) return res.status(401).json({ message: 'Unauthorized' });
    const { courseTitle } = req.params;
    const { progressPct, completedLessonIds } = req.body;

    const updated = await Progress.findOneAndUpdate(
      { userKey, courseTitle },
      { $set: { progressPct, completedLessonIds } },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update progress' });
  }
};
