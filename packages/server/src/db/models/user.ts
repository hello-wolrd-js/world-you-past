import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  usernid: { type: String, required: true, unique: true },
  location: [{
    longitude: String,
    latitude: String,
  }],
});
const User = mongoose.model('user', userSchema);
export default User;