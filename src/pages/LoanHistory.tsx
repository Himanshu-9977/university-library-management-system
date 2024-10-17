import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface Loan {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  bookId: {
    _id: string;
    title: string;
  };
  issuedDate: string;
  dueDate: string;
  returnedDate: string | null;
  fine: number;
}

const LoanHistory = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/loans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const handleReturnBook = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/loans/${id}/return`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: 'Success', description: 'Book returned successfully' });
      fetchLoans();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to return book', variant: 'destructive' });
    }
  };

  const filteredLoans = loans.filter(
    (loan) =>
      loan.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.bookId.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Loan History</h1>
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search loans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Book</TableHead>
            <TableHead>Issued Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Fine</TableHead>
            {(user?.role === 'librarian' || user?.role === 'admin') && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLoans.map((loan) => (
            <TableRow key={loan._id}>
              <TableCell>{loan.userId.name}</TableCell>
              <TableCell>{loan.bookId.title}</TableCell>
              <TableCell>{new Date(loan.issuedDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(loan.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>{loan.returnedDate ? 'Returned' : 'Active'}</TableCell>
              <TableCell>${loan.fine.toFixed(2)}</TableCell>
              {(user?.role === 'librarian' || user?.role === 'admin') && (
                <TableCell>
                  {!loan.returnedDate && (
                    <Button variant="outline" size="sm" onClick={() => handleReturnBook(loan._id)}>
                      Return
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LoanHistory;