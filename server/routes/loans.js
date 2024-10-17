import express from 'express';
import Loan from '../models/Loan.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get all loans
router.get('/', authenticateToken, async (req, res) => {
  try {
    const loans = await Loan.find().populate('userId', 'name').populate('bookId', 'title');
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new loan
router.post('/', authenticateToken, authorizeRole(['librarian', 'admin']), async (req, res) => {
  try {
    const { userId, bookId, dueDate } = req.body;
    const book = await Book.findById(bookId);
    if (!book || !book.available) {
      return res.status(400).json({ error: 'Book is not available' });
    }
    const loan = new Loan({ userId, bookId, dueDate });
    await loan.save();
    book.available = false;
    book.borrowerId = userId;
    await book.save();
    await User.findByIdAndUpdate(userId, { $push: { borrowedBooks: bookId } });
    res.status(201).json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Return a book
router.put('/:id/return', authenticateToken, authorizeRole(['librarian', 'admin']), async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    if (loan.returnedDate) return res.status(400).json({ error: 'Book already returned' });
    
    loan.returnedDate = new Date();
    const daysOverdue = Math.max(0, (loan.returnedDate - loan.dueDate) / (1000 * 60 * 60 * 24));
    loan.fine = Math.round(daysOverdue * 0.5 * 100) / 100; // $0.50 per day, rounded to 2 decimal places
    await loan.save();
    
    await Book.findByIdAndUpdate(loan.bookId, { available: true, borrowerId: null });
    await User.findByIdAndUpdate(loan.userId, { $pull: { borrowedBooks: loan.bookId } });
    
    res.json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;