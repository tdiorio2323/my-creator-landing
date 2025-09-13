import { useState } from 'react'
import { 
  CreditCard, DollarSign, Calendar, TrendingUp, Download, 
  Eye, EyeOff, AlertCircle, CheckCircle, Clock, Wallet,
  ArrowUpRight, ArrowDownLeft, Filter, Search, MoreVertical,
  PiggyBank, Zap, Shield, Gift, Star, Crown, Settings
} from 'lucide-react'

export default function PaymentCenter() {
  const [showBalance, setShowBalance] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedMethod, setSelectedMethod] = useState('all')

  // Mock payment data
  const paymentData = {
    balance: {
      available: 2847.50,
      pending: 456.80,
      total: 15247.30,
      nextPayout: '2024-02-01'
    },
    earnings: {
      today: 145.60,
      week: 892.40,
      month: 3247.80,
      allTime: 15247.30
    },
    methods: [
      {
        id: 1,
        type: 'bank',
        name: 'Bank Transfer',
        account: '****1234',
        isDefault: true,
        fee: '0%',
        processingTime: '1-3 business days'
      },
      {
        id: 2,
        type: 'paypal',
        name: 'PayPal',
        account: 'user@example.com',
        isDefault: false,
        fee: '2.9%',
        processingTime: 'Instant'
      },
      {
        id: 3,
        type: 'crypto',
        name: 'Bitcoin',
        account: '1A1z...P2SH',
        isDefault: false,
        fee: '1%',
        processingTime: '10-30 minutes'
      }
    ],
    transactions: [
      {
        id: 1,
        type: 'subscription',
        description: 'Premium Subscription - Sarah M.',
        amount: 19.99,
        fee: 1.20,
        net: 18.79,
        status: 'completed',
        date: '2024-01-15T10:30:00Z',
        tier: 'Premium'
      },
      {
        id: 2,
        type: 'tip',
        description: 'Tip from Mike J.',
        amount: 25.00,
        fee: 1.50,
        net: 23.50,
        status: 'completed',
        date: '2024-01-15T09:15:00Z',
        tier: 'VIP'
      },
      {
        id: 3,
        type: 'payout',
        description: 'Bank Transfer Payout',
        amount: -500.00,
        fee: 0.00,
        net: -500.00,
        status: 'processing',
        date: '2024-01-14T16:20:00Z',
        tier: null
      },
      {
        id: 4,
        type: 'ppv',
        description: 'Pay-per-view - Premium Content',
        amount: 9.99,
        fee: 0.60,
        net: 9.39,
        status: 'completed',
        date: '2024-01-14T14:45:00Z',
        tier: 'Basic'
      },
      {
        id: 5,
        type: 'subscription',
        description: 'VIP Subscription - Emma W.',
        amount: 49.99,
        fee: 3.00,
        net: 46.99,
        status: 'pending',
        date: '2024-01-14T11:10:00Z',
        tier: 'VIP'
      }
    ],
    payouts: [
      {
        id: 1,
        amount: 1500.00,
        method: 'Bank Transfer',
        status: 'completed',
        date: '2024-01-01',
        reference: 'PO-2024-001'
      },
      {
        id: 2,
        amount: 2000.00,
        method: 'PayPal',
        status: 'processing',
        date: '2024-01-10',
        reference: 'PO-2024-002'
      }
    ]
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'processing': return 'text-yellow-400'
      case 'pending': return 'text-blue-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle
      case 'processing': return Clock
      case 'pending': return AlertCircle
      default: return AlertCircle
    }
  }

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'VIP': return Crown
      case 'Premium': return Star
      default: return null
    }
  }

  const requestPayout = async () => {
    // Mock API call - leave empty for backend integration
    const mockRequestPayout = async (amount, method) => {
      // TODO: Integrate with payment processor API
      console.log('Requesting payout:', { amount, method })
      // return await fetch('/api/payouts/request', { method: 'POST', body: ... })
    }

    await mockRequestPayout(paymentData.balance.available, selectedMethod)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Center</h1>
            <p className="text-white/60">Manage your earnings, payouts, and payment methods</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">This Year</option>
            </select>
            
            <button className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all">
              <Download className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Balance Card */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-500/20 backdrop-blur-sm rounded-xl">
                  <Wallet className="h-6 w-6 text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Available Balance</h2>
              </div>
              
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                {showBalance ? <Eye className="h-5 w-5 text-white/60" /> : <EyeOff className="h-5 w-5 text-white/60" />}
              </button>
            </div>
            
            <div className="mb-8">
              <div className="text-4xl font-bold text-white mb-2">
                {showBalance ? `$${paymentData.balance.available.toLocaleString()}` : '••••••'}
              </div>
              <div className="flex items-center space-x-4 text-white/60">
                <span>Pending: ${showBalance ? paymentData.balance.pending.toLocaleString() : '•••'}</span>
                <span>•</span>
                <span>Next payout: {paymentData.balance.nextPayout}</span>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={requestPayout}
                className="bg-primary-500/80 backdrop-blur-sm hover:bg-primary-600/80 text-white font-medium py-4 px-6 rounded-xl transition-all border border-primary-400/50"
              >
                Request Payout
              </button>
              <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium py-4 px-6 rounded-xl transition-all border border-white/20">
                View Statements
              </button>
            </div>
          </div>
          
          {/* Earnings Summary */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Today&apos;s Earnings</h3>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                ${paymentData.earnings.today}
              </div>
              <div className="flex items-center text-green-400 text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+12.5% from yesterday</span>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">This Month</h3>
                <DollarSign className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                ${paymentData.earnings.month.toLocaleString()}
              </div>
              <div className="flex items-center text-blue-400 text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+8.3% from last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Payment Methods</h3>
            <button className="px-4 py-2 bg-primary-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-primary-600/80 transition-all">
              Add Method
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentData.methods.map((method) => (
              <div key={method.id} className={`p-4 bg-white/5 backdrop-blur-sm rounded-xl border transition-all hover:bg-white/10 ${
                method.isDefault ? 'border-primary-400/50' : 'border-white/10'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                      {method.type === 'bank' && <CreditCard className="h-5 w-5 text-white" />}
                      {method.type === 'paypal' && <Wallet className="h-5 w-5 text-white" />}
                      {method.type === 'crypto' && <Zap className="h-5 w-5 text-white" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{method.name}</h4>
                      <p className="text-white/60 text-sm">{method.account}</p>
                    </div>
                  </div>
                  
                  {method.isDefault && (
                    <span className="bg-primary-500/30 text-primary-200 text-xs px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Fee:</span>
                    <span>{method.fee}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Processing:</span>
                    <span>{method.processingTime}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 text-xs bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-all">
                    Edit
                  </button>
                  <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all">
                <Filter className="h-4 w-4 text-white" />
              </button>
              <button className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all">
                <Search className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium">Description</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium">Fee</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium">Net</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-white/60 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {paymentData.transactions.map((transaction) => {
                  const StatusIcon = getStatusIcon(transaction.status)
                  const TierIcon = getTierIcon(transaction.tier)
                  
                  return (
                    <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg ${
                            transaction.type === 'subscription' ? 'bg-blue-500/20' :
                            transaction.type === 'tip' ? 'bg-yellow-500/20' :
                            transaction.type === 'payout' ? 'bg-red-500/20' :
                            'bg-green-500/20'
                          }`}>
                            {transaction.type === 'subscription' && <CreditCard className="h-4 w-4 text-blue-400" />}
                            {transaction.type === 'tip' && <Gift className="h-4 w-4 text-yellow-400" />}
                            {transaction.type === 'payout' && <ArrowDownLeft className="h-4 w-4 text-red-400" />}
                            {transaction.type === 'ppv' && <Eye className="h-4 w-4 text-green-400" />}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-white">{transaction.description}</span>
                          {TierIcon && <TierIcon className={`h-4 w-4 ${
                            transaction.tier === 'VIP' ? 'text-yellow-400' : 'text-purple-400'
                          }`} />}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${
                          transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white/60">${transaction.fee}</td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${
                          transaction.net > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.net > 0 ? '+' : ''}${Math.abs(transaction.net)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className={`h-4 w-4 ${getStatusColor(transaction.status)}`} />
                          <span className={`text-sm ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white/60">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-500/20 backdrop-blur-sm rounded-xl">
              <Shield className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Security & Compliance</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h4 className="font-medium text-white mb-1">PCI Compliant</h4>
              <p className="text-white/60 text-sm">Secure payment processing</p>
            </div>
            
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl">
              <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h4 className="font-medium text-white mb-1">SSL Encrypted</h4>
              <p className="text-white/60 text-sm">End-to-end encryption</p>
            </div>
            
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl">
              <CheckCircle className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h4 className="font-medium text-white mb-1">KYC Verified</h4>
              <p className="text-white/60 text-sm">Identity verified</p>
            </div>
            
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl">
              <PiggyBank className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="font-medium text-white mb-1">FDIC Insured</h4>
              <p className="text-white/60 text-sm">Bank-level protection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}