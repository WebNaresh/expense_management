## Expense Management System

A streamlined task management system with user authentication, WhatsApp integration, and LinkedIn sharing capabilities.

## Features

- **User Management**

  - Unique user identification with email
  - WhatsApp integration for notifications
  - LinkedIn integration for sharing updates
  - Secure authentication with Google and LinkedIn

- **Task Management**

  - Track to-do items and reminders
  - Set due dates
  - Mark tasks as completed
  - Organize tasks by priority

- **Integration Features**
  - WhatsApp integration for notifications and reminders
  - LinkedIn integration for sharing accomplishments
  - Multi-platform support

## Data Model

### User

```prisma
model User {
  id                  String    @id @default(uuid())
  name                String
  email               String    @unique
  whatsappVerified    Boolean   @default(false)
  whatsappNumber      String?   @unique
  linkedinAccessToken String?
  linkedinTokenExpiry DateTime?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  tasks               Task[]

  @@unique([whatsappNumber, email])
  @@index([email])
  @@index([whatsappNumber])
  @@index([name])
}
```

### Task

```prisma
model Task {
  id          String   @id @default(uuid())
  name        String
  description String
  dueDate     DateTime
  isCompleted Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id])
  userId      String
}
```

## Usage Examples

### 1. Managing Users

```typescript
// Creating a new user
const user = await prisma.user.create({
  data: {
    name: "John Doe",
    email: "john.doe@example.com",
    whatsappVerified: false,
  },
});

// Update user with WhatsApp verification
const verifiedUser = await prisma.user.update({
  where: {
    email: "john.doe@example.com",
  },
  data: {
    whatsappNumber: "+919876543210",
    whatsappVerified: true,
  },
});
```

### 2. Managing Tasks

```typescript
// Creating a new task
const task = await prisma.task.create({
  data: {
    name: "Complete project proposal",
    description: "Finish the proposal document for the client meeting",
    dueDate: new Date("2023-05-15"),
    isCompleted: false,
    user: {
      connect: {
        id: "user_id",
      },
    },
  },
});

// Marking a task as completed
const completedTask = await prisma.task.update({
  where: {
    id: "task_id",
  },
  data: {
    isCompleted: true,
    updatedAt: new Date(),
  },
});

// Get all upcoming tasks for a user
const upcomingTasks = await prisma.task.findMany({
  where: {
    userId: "user_id",
    isCompleted: false,
    dueDate: {
      gte: new Date(),
    },
  },
  orderBy: {
    dueDate: "asc",
  },
});
```

### 3. Social Media Integration

```typescript
// Update user with LinkedIn access token
const user = await prisma.user.update({
  where: {
    id: "user_id",
  },
  data: {
    linkedinAccessToken: "linkedin_access_token",
    linkedinTokenExpiry: new Date(Date.now() + 3600 * 1000), // 1 hour expiry
  },
});

// Check if LinkedIn token is valid
const isLinkedInConnected = (user) => {
  return (
    user.linkedinAccessToken &&
    user.linkedinTokenExpiry &&
    new Date(user.linkedinTokenExpiry) > new Date()
  );
};

// Update WhatsApp verification status
const verifyWhatsApp = await prisma.user.update({
  where: {
    id: "user_id",
  },
  data: {
    whatsappNumber: "+919876543210",
    whatsappVerified: true,
  },
});
```

## Setup Instructions

1. **Clone the Repository**

```bash
git clone <repository-url>
cd expense_management
```

2. **Install Dependencies**

```bash
npm install
# or using yarn
yarn install
```

3. **Set Up Environment Variables**
   Create a `.env` file with the following:

```env
# Database Connection - PostgreSQL on Neon
# Format: postgresql://user:password@hostname:port/database
DATABASE_URL="postgresql://[username]:[password]@[neon-hostname]/neondb"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"  # Set to your deployment URL in production
NEXT_PUBLIC_SECRET="your-nextauth-secret"

# Google Authentication (OAuth)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="google-client-id-from-console"
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET="google-client-secret-from-console"

# LinkedIn Authentication (OAuth)
NEXT_LINKEDIN_CLIENT_ID="linkedin-client-id-from-developer-portal"
NEXT_LINKEDIN_CLIENT_SECRET="linkedin-client-secret-from-developer-portal"

# WhatsApp Integration
WHATSAPP_VERIFY_TOKEN="your-whatsapp-verification-token"
```

> Note: Never commit your `.env` file to version control. Add it to your `.gitignore` file.

4. **Initialize Database**

```bash
# Option 1: Push the schema directly without migrations (recommended for development)
npx prisma db push

# Option 2: Create migrations and apply them (better for production)
npx prisma migrate dev --name init

# Generate Prisma client (always required after schema changes)
npx prisma generate

# Optional: View your database with Prisma Studio
npx prisma studio
```

> Note: If you're using Neon or another serverless PostgreSQL provider, you might need to use the pooled connection string from your provider.

5. **Start the Development Server**

```bash
npm run dev
# or using yarn
yarn dev
```

6. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This application is designed to be easily deployed to Vercel:

1. **Create a Vercel Account** (if you don't have one already)

   - Sign up at [vercel.com](https://vercel.com)

2. **Install Vercel CLI** (optional)

   ```bash
   npm install -g vercel
   ```

3. **Deploy from GitHub**

   - Push your code to GitHub
   - Import the repository in the Vercel dashboard
   - Configure the following environment variables in the Vercel dashboard:
     - `DATABASE_URL`: Your Neon database connection string
     - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., https://your-app.vercel.app)
     - `NEXT_PUBLIC_SECRET`: Your NextAuth secret
     - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google OAuth client ID
     - `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
     - `NEXT_LINKEDIN_CLIENT_ID`: Your LinkedIn OAuth client ID
     - `NEXT_LINKEDIN_CLIENT_SECRET`: Your LinkedIn OAuth client secret
     - `WHATSAPP_VERIFY_TOKEN`: Your WhatsApp verification token

4. **Deploy from CLI** (alternative)

   ```bash
   vercel
   ```

5. **Enable Preview Deployments** (recommended)
   - In the Vercel dashboard, configure preview deployments for pull requests

For more deployment options, see the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## Project Structure

```
expense_management/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── whatsapp/         # WhatsApp integration
│   │   └── ...               # Other API endpoints
│   ├── dashboard/            # Dashboard pages
│   │   └── _components/      # Dashboard components
│   ├── login/                # Authentication pages
│   └── ...                   # Other app pages
├── components/               # Reusable components
│   ├── AppInputFields/       # Form components
│   └── ui/                   # UI components (shadcn/ui)
├── lib/                      # Utility functions
│   ├── auth.ts               # Authentication configuration
│   ├── prisma.ts             # Prisma client
│   └── ...                   # Other utilities
├── prisma/                   # Database configuration
│   └── schema.prisma         # Database schema
├── provider/                 # Context providers
├── public/                   # Static assets
└── types/                    # TypeScript type definitions
```

## Advanced Features

### WhatsApp Integration

The application includes WhatsApp integration for:

- Receiving task reminders
- Managing tasks via WhatsApp messages
- Getting notification updates

### LinkedIn Sharing

Users can share their accomplishments on LinkedIn:

- Connect LinkedIn account from the dashboard
- Share task completions and milestones
- Post achievements with customized privacy settings

## API Documentation

The system exposes RESTful APIs for:

- User management
- Task handling
- WhatsApp integration
- LinkedIn sharing

Detailed API documentation is available in the `/docs` directory.

## Security

- User data is stored securely in a PostgreSQL database
- User authentication via Google and LinkedIn
- Sensitive data is encrypted at rest

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
