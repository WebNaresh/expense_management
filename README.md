# Financial Tracking System

A comprehensive system for tracking personal finances, including subscriptions, variable expenses, loans, and overall balance management.

## Features

- **User Management**

  - Unique user identification with email
  - Personal balance tracking
  - Comprehensive transaction history

- **Subscription Tracking**

  - Fixed monthly subscriptions (e.g., Cursory AI, ChatGPT)
  - Billing date management
  - Active/Inactive status tracking

- **Variable Expense Management**

  - Flexible expense tracking (e.g., AWS bills)
  - Categorization of expenses
  - Date-based expense recording

- **Loan Management**

  - Track money borrowed and lent
  - Loan status tracking (Pending/Paid/Cancelled)
  - Detailed loan descriptions

- **Balance Tracking**
  - Real-time balance updates
  - Total amount owed calculation
  - Total amount received tracking

## Data Model

### User

```prisma
model User {
  id                String              @id @default(uuid())
  name              String              @unique
  email             String              @unique
  takenLoans        Loan[]              // Loans taken from others
  givenLoans        Loan[]              // Loans given to others
  subscriptions     Subscription[]      // Monthly subscriptions
  variableExpenses  VariableExpense[]   // Variable expenses like AWS
  balance           Balance?            // Current financial status
}
```

### Subscription

```prisma
model Subscription {
  id          String    @id
  name        String    // e.g., "Cursory AI", "ChatGPT"
  amount      Float     // Fixed monthly amount
  isActive    Boolean   // Track active subscriptions
  billingDate DateTime  // Monthly billing date
  description String?   // Optional details
}
```

### Variable Expense

```prisma
model VariableExpense {
  id          String    @id
  name        String    // e.g., "AWS"
  amount      Float     // Variable amount
  category    String    // Expense category
  date        DateTime  // Transaction date
  description String?   // Optional details
}
```

### Loan

```prisma
model Loan {
  id          String     @id
  from        User       // Lender
  to          User       // Borrower
  amount      Float      // Loan amount
  status      LoanStatus // PENDING/PAID/CANCELLED
  description String?    // Loan purpose/details
}
```

### Balance

```prisma
model Balance {
  currentBalance  Float    // Available balance
  totalOwed       Float    // Total amount owed
  totalReceived   Float    // Total amount received
  lastUpdated     DateTime // Last balance update
}
```

## Usage Examples

### 1. Managing Subscriptions

```typescript
// Adding a new subscription
const subscription = await prisma.subscription.create({
  data: {
    name: "Cursory AI",
    amount: 1707.0,
    isActive: true,
    billingDate: new Date(),
    userId: "user_id",
  },
});
```

### 2. Recording Variable Expenses

```typescript
// Recording AWS bill
const expense = await prisma.variableExpense.create({
  data: {
    name: "AWS",
    amount: 2500.5,
    category: "Cloud Services",
    date: new Date(),
    userId: "user_id",
  },
});
```

### 3. Managing Loans

```typescript
// Recording a new loan
const loan = await prisma.loan.create({
  data: {
    fromId: "lender_id",
    toId: "borrower_id",
    amount: 6000.0,
    status: "PENDING",
    description: "Bike purchase",
  },
});
```

### 4. Tracking Balance

```typescript
// Updating user balance
const balance = await prisma.balance.update({
  where: { userId: "user_id" },
  data: {
    currentBalance: 5000.0,
    totalOwed: 2000.0,
    totalReceived: 7000.0,
  },
});
```

## Setup Instructions

1. **Clone the Repository**

```bash
git clone <repository-url>
```

2. **Install Dependencies**

```bash
npm install
```

3. **Set Up Environment Variables**
   Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
```

4. **Initialize Database**

```bash
npx prisma migrate dev
```

5. **Start the Application**

```bash
npm run dev
```

## API Documentation

The system exposes RESTful APIs for:

- User management
- Subscription handling
- Expense tracking
- Loan management
- Balance updates

Detailed API documentation is available in the `/docs` directory.

## Security

- All financial data is stored securely in a PostgreSQL database
- User authentication and authorization required for all operations
- Sensitive data is encrypted at rest

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Structure

1. **Subscriptions & Expenses:**
   - Monthly fixed expenses (e.g., Cursory AI, ChatGPT, and AWS).
2. **Loan Tracking:**
   - Loans from friends or payments owed (e.g., Vivek's ₹6,000 for the bike, Aniket owes ₹6,000 to Vivek).
3. **Balance Calculation:**
   - Track how much you owe, how much you've received, and what your current balance is after all transactions.

---

## Example

Here's an example of how the system works with your given scenario:

1. **Subscriptions:**
   - **Cursory AI** subscription: ₹1,707/month
   - **ChatGPT** subscription: ₹2,000/month
   - **AWS bill:** Variable (depends on usage)
2. **Loan Tracking:**
   - Vivek gave you ₹6,000 for the bike.
   - You contributed ₹4,000 for the bike.
   - Aniket owes ₹6,000 to Vivek for the bike (not you).

### Calculations:

- You owe the monthly subscription costs.
- You have received ₹6,000 from Vivek for the bike, and Aniket owes ₹6,000 to Vivek.
- Keep track of monthly expenses, income (received from Vivek), and outstanding loan repayments.

---

## Setup Instructions

### Prerequisites

- Node.js (if you are automating calculations via code)
- A spreadsheet (optional, for manual tracking)

---

### Manual Tracking Using Spreadsheet

If you prefer a manual tracking system (using a spreadsheet):

1. **Create a Spreadsheet** with the following columns:

   - **Date:** The date of the transaction (e.g., subscription payment, loan received).
   - **Description:** A short description (e.g., "Cursory AI subscription").
   - **Amount Owed:** The amount you owe (for subscription payments).
   - **Amount Received:** The amount you received (e.g., from Vivek for the bike).
   - **Balance:** Track your balance after each transaction.

2. **Tracking Example:**

| Date       | Description          | Amount Owed | Amount Received | Balance          |
| ---------- | -------------------- | ----------- | --------------- | ---------------- |
| 01-05-2025 | Cursory AI           | ₹1,707      |                 | -₹1,707          |
| 01-05-2025 | ChatGPT Subscription | ₹2,000      |                 | -₹3,707          |
| 01-05-2025 | AWS Bill             | Variable    |                 | -₹[AWS]          |
| 01-05-2025 | Vivek's Loan (Bike)  |             | ₹6,000          | ₹6,000           |
| 01-05-2025 | Aniket's Repayment   | ₹6,000      |                 | ₹[final balance] |

---

### Automated Tracking with Node.js

If you want to automate this process using Node.js, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/financial-tracking.git
   ```
