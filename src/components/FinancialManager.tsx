import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, TrendingUp, TrendingDown, Wallet, Download } from 'lucide-react';
import { apiClient } from '@/lib/api';

export function FinancialManager() {
  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [newTransaction, setNewTransaction] = useState({
    transactionType: 'expense',
    category: 'seeds',
    amount: '',
    description: '',
    paymentMethod: 'cash'
  });

  useEffect(() => {
    fetchTransactions();
    fetchReport();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await apiClient.get('/transactions');
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions');
    }
  };

  const fetchReport = async () => {
    try {
      const response = await apiClient.get('/financial-report');
      if (response.data.success) {
        setReport(response.data.report);
      }
    } catch (error) {
      console.error('Failed to fetch report');
    }
  };

  const addTransaction = async () => {
    if (!newTransaction.amount || parseFloat(newTransaction.amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/transactions', {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount)
      });

      if (response.data.success) {
        toast({
          title: 'Transaction Recorded',
          description: 'Transaction saved successfully with blockchain verification'
        });
        setNewTransaction({
          transactionType: 'expense',
          category: 'seeds',
          amount: '',
          description: '',
          paymentMethod: 'cash'
        });
        fetchTransactions();
        fetchReport();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to record transaction',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  return (
    <Tabs defaultValue="add" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="add">Add Transaction</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="report">Financial Report</TabsTrigger>
      </TabsList>

      <TabsContent value="add">
        <Card>
          <CardHeader>
            <CardTitle>Record Transaction</CardTitle>
            <CardDescription>All transactions are secured with blockchain technology</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select
                value={newTransaction.transactionType}
                onValueChange={(v) => setNewTransaction({ ...newTransaction, transactionType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Category</Label>
              <Select
                value={newTransaction.category}
                onValueChange={(v) => setNewTransaction({ ...newTransaction, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seeds">Seeds</SelectItem>
                  <SelectItem value="fertilizers">Fertilizers</SelectItem>
                  <SelectItem value="pesticides">Pesticides</SelectItem>
                  <SelectItem value="labor">Labor</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Amount (KES)</Label>
              <Input
                type="number"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                placeholder="1000"
              />
            </div>

            <div>
              <Label>Payment Method</Label>
              <Select
                value={newTransaction.paymentMethod}
                onValueChange={(v) => setNewTransaction({ ...newTransaction, paymentMethod: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                placeholder="Enter details..."
              />
            </div>

            <Button onClick={addTransaction} disabled={loading} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Record Transaction
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View all your recorded transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No transactions yet</p>
              ) : (
                transactions.map((txn: any) => (
                  <div key={txn._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{txn.category}</p>
                      <p className="text-sm text-muted-foreground">{txn.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${txn.transactionType === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.transactionType === 'income' ? '+' : '-'}KES {txn.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{txn.paymentMethod}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="report">
        {report && (
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    KES {report.totalIncome.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">
                    KES {report.totalExpenses.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${report.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    KES {report.profit.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(report.expensesByCategory || {}).map(([category, amount]: [string, any]) => (
                    <div key={category} className="flex items-center justify-between">
                      <p className="capitalize">{category}</p>
                      <p className="font-semibold">KES {amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Financial Statement
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
