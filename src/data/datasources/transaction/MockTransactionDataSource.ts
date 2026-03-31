import {TransactionModel} from '../../models/TransactionModel';
import {TransactionDataSource} from './TransactionDataSource';

const MOCK_TRANSACTIONS: TransactionModel[] = [
  {
    id: '1',
    description: 'Depósito de nómina',
    amount: 15000.0,
    date: '2026-03-28',
    type: 'income',
    category: 'salary',
    status: 'completed',
    createdAt: '2026-03-28T06:00:00Z',
    updatedAt: '2026-03-28T06:00:00Z',
    userId: 'usr_001',
    reference: 'NOM-2026-03-28-001',
    metadata: {source: 'payroll_system', batch: 'B-1120'},
  },
  {
    id: '2',
    description: 'Supermercado La Comer',
    amount: 1250.5,
    date: '2026-03-27',
    type: 'expense',
    category: 'food',
    status: 'completed',
    createdAt: '2026-03-27T14:30:00Z',
    updatedAt: '2026-03-27T14:30:00Z',
    userId: 'usr_001',
    reference: 'POS-87623',
    metadata: {terminal: 'T-042', merchant: 'La Comer Sucursal Centro'},
  },
  {
    id: '3',
    description: 'Uber - Oficina a Casa',
    amount: 89.0,
    date: '2026-03-27',
    type: 'expense',
    category: 'transport',
    status: 'completed',
    createdAt: '2026-03-27T19:15:00Z',
    updatedAt: '2026-03-27T19:20:00Z',
    userId: 'usr_001',
    reference: 'UBER-RX9281',
    metadata: null,
  },
  {
    id: '4',
    description: 'Netflix suscripción',
    amount: 199.0,
    date: '2026-03-26',
    type: 'expense',
    category: 'entertainment',
    status: 'completed',
    createdAt: '2026-03-26T00:00:00Z',
    updatedAt: '2026-03-26T00:05:00Z',
    userId: 'usr_001',
    reference: 'NFLX-SUB-032026',
    metadata: {subscription: true, renewalDate: '2026-04-26'},
  },
  {
    id: '5',
    description: 'Transferencia recibida',
    amount: 3500.0,
    date: '2026-03-25',
    type: 'income',
    category: 'transfer',
    status: 'completed',
    createdAt: '2026-03-25T11:00:00Z',
    updatedAt: '2026-03-25T11:00:00Z',
    userId: 'usr_001',
    reference: 'SPEI-20260325-789456',
    metadata: {senderBank: 'BBVA', senderName: 'Juan Pérez'},
  },
  {
    id: '6',
    description: 'Amazon - Audífonos',
    amount: 899.0,
    date: '2026-03-25',
    type: 'expense',
    category: 'shopping',
    status: 'pending',
    createdAt: '2026-03-25T16:45:00Z',
    updatedAt: '2026-03-25T16:45:00Z',
    userId: 'usr_001',
    reference: 'AMZ-ORD-11298374',
    metadata: {orderId: '113-9982731-2288201', estimatedDelivery: '2026-03-30'},
  },
  {
    id: '7',
    description: 'Pago de luz CFE',
    amount: 420.0,
    date: '2026-03-24',
    type: 'expense',
    category: 'services',
    status: 'completed',
    createdAt: '2026-03-24T09:30:00Z',
    updatedAt: '2026-03-24T09:35:00Z',
    userId: 'usr_001',
    reference: 'CFE-REC-2026-03',
    metadata: {serviceNumber: 'CFE-123456789', period: 'Feb-Mar 2026'},
  },
  {
    id: '8',
    description: 'Consulta médica',
    amount: 650.0,
    date: '2026-03-23',
    type: 'expense',
    category: 'health',
    status: 'cancelled',
    createdAt: '2026-03-23T10:00:00Z',
    updatedAt: '2026-03-23T18:00:00Z',
    userId: 'usr_001',
    reference: 'MED-CITA-0323',
    metadata: {cancellationReason: 'patient_request'},
  },
];

const SIMULATED_DELAY_MS = 1000;

export class MockTransactionDataSource implements TransactionDataSource {
  async getTransactions(): Promise<TransactionModel[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_TRANSACTIONS);
      }, SIMULATED_DELAY_MS);
    });
  }
}
