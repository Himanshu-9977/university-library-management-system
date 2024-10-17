import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: [{ type: String }],
  available: { type: Boolean, default: true },
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date },
});

const Book = mongoose.model('Book', bookSchema);

export default Book;