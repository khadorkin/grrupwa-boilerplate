import mongoose from 'mongoose';
import User from '../src/data/models/User';
import { DATABASE_URL } from '../src/config';

export default async () => {
  mongoose.connect(DATABASE_URL);

  const user = new User({
    name: 'Minh',
  });

  user.save();
};
