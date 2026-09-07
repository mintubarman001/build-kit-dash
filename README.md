# Site Stock Manager

Build a modern responsive UI mockup for a "Construction Inventory Management System".

Use React + Tailwind CSS with mock data only. No backend or database.

Design:

- Professional B2B construction management style

- Dark left sidebar

- White/light gray content area

- Orange/amber construction accent

- Clean tables, cards, forms and modals

- Responsive desktop/tablet/mobile

- Use Lucide icons

SIDEBAR:

Dashboard

Inventory

- Purchase / Inward

- Stock

- Items

- Categories

- Vendors

Outward

- New Requisition

- Requisition History

Reports

- Stock Report

- Stock Transactions

Users

- Users

- Roles & Permissions

1. DASHBOARD

Create a simple dashboard with:

- Total Items

- Available Stock

- Total Purchase

- Total Outward

- Low Stock

- Pending Requisitions

- Stock Inward vs Outward chart

- Recent transactions

- Low stock items

2. PURCHASE / INWARD

Create purchase listing with:

- Purchase ID

- Invoice

- Vendor

- Item

- Category

- Quantity

- Rate

- Total

- Date

- Attachment

- Actions

Add Purchase modal:

- Vendor

- Date

- Invoice No

- Evidence Attachment

- Item

- Category

- Quantity

- Unit

- Rate

- Notes

- Total amount

Allow adding multiple items.

3. STOCK

Create current stock page with:

- Item

- Category

- Unit

- Inward

- Outward

- Available Stock

- Minimum Stock

- Status

Show In Stock / Low Stock / Out of Stock badges.

Click an item to see stock details and recent transactions.

4. OUTWARD / REQUISITION

Create New Requisition page.

Location:

- Block + Flat

- Block Only

- Custom Location

Fields:

- Block No

- Flat No

- Custom Location

- Requested By

- Date

- Item

- Available Stock

- Requested Quantity

- Unit

- Note

Prevent requested quantity from exceeding available stock.

Buttons:

- Save Draft

- Submit Requisition

5. REQUISITION HISTORY

Show:

- Requisition ID

- Block

- Flat

- Requested By

- Items

- Quantity

- Date

- Status

- Actions

Statuses:

Pending, Approved, Issued, Rejected

6. STOCK TRANSACTION REPORT

Create filters:

- Date

- Block No

- Flat No

- Item

- Category

- Transaction Type

- User

Support:

- Item-wise search

- Flat-wise search

Table:

- Date

- Transaction ID

- Type

- Item

- Quantity

- Block

- Flat

- User

- Reference

Show inward as + and outward as -.

Add Export CSV and Print buttons.

7. STOCK REPORT

Show:

- Item

- Category

- Opening Stock

- Total Inward

- Total Outward

- Closing Stock

- Stock Value

- Status

Closing Stock = Opening + Inward - Outward + Adjustments

8. USERS

Create Users page with:

- Name

- Email

- Phone

- Role

- Assigned Site

- Status

- Last Login

- Actions

Add/Edit User modal.

9. ROLES & PERMISSIONS

Create simple role management page.

Roles:

- Admin

- Store Manager

- Site Engineer

- Project Manager

- Management

Show permission matrix for:

- Dashboard

- Purchase

- Stock

- Outward

- Reports

- Users

- Settings

FUNCTIONAL MOCKUP

Use realistic Indian construction data:

- Cement

- Steel

- Tiles

- Electrical items

- Plumbing items

- Hardware

Use ₹ currency and Block/Flat numbers.

Implement only essential frontend interactions:

- Sidebar navigation

- Search

- Filters

- Add/Edit modals

- Dynamic purchase/requisition items

- Stock quantity validation

- Toast notifications

- Status changes

- Responsive mobile sidebar

Keep the implementation simple and lightweight.

Do NOT create unnecessary pages, complex architecture, authentication,

backend, API, database, or advanced features.

The goal is a polished clickable UI prototype that can be presented

to a client.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3c73bc1c-411f-4adf-97d9-ce33db6a5610).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
