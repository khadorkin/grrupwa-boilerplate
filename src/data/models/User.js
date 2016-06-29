import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
  },
});

const User = mongoose.model('User', UserSchema);

export default User;
