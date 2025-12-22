# 💊 PharmaCare - Pharmacy Management System

A modern, full-featured pharmacy management system built with Next.js 16, featuring role-based dashboards, e-commerce capabilities, and a beautiful neumorphic UI.

![PharmaCare](public/icon.svg)

## ✨ Features

### 🛒 E-Commerce
- Browse and search medicines by category
- Shopping cart with persistent state
- Secure checkout process
- Order tracking and history

### 👤 Role-Based Dashboards
- **Admin Dashboard**: Full system management (users, orders, medicines, categories, prescriptions, audit logs)
- **Pharmacist Dashboard**: Prescription review, order processing, inventory management
- **Customer Dashboard**: Order history, profile management, prescription uploads

### 🎨 UI/UX
- Dark/Light mode with smooth neumorphic toggle (slow-motion animations)
- Responsive design for all devices
- Modern card-based layouts
- Toast notifications for feedback

### 🔐 Security
- Role-based access control
- Prescription validation workflow
- Audit logging for compliance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdallahMohamedDotnet/pharmacy-management-system.git

# Navigate to project directory
cd pharmacy-management-system

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Context
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📁 Project Structure

```
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard pages
│   ├── pharmacist/        # Pharmacist dashboard pages
│   ├── dashboard/         # Role-based dashboard router
│   └── ...
├── components/
│   ├── admin/             # Admin-specific components
│   ├── pharmacist/        # Pharmacist-specific components
│   ├── customer/          # Customer-specific components
│   ├── store/             # E-commerce components
│   ├── ui/                # Reusable UI components
│   └── layout/            # Layout components
├── contexts/              # React contexts
├── lib/                   # Utilities and API services
└── public/                # Static assets
```

## 👨‍💻 Author

**Abdallah Mohamed**
- GitHub: [@AbdallahMohamedDotnet](https://github.com/AbdallahMohamedDotnet)

## 📄 License

This project is licensed under the MIT License.
