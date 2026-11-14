# Expensetrackerfinal

Build a complete responsive web application called "Personal Expense Tracker".

Tech stack: React + Tailwind CSS + localStorage (no backend needed for now).

Design:

- Modern, clean, simple, beginner-friendly

- White/light background with soft green accents

- Mobile-first and fully responsive

- Clean cards, clear labels, short forms

Main features:

1. Dashboard

   - Total Income

   - Total Expenses

   - Remaining Balance (Total Income - Total Expenses)

   - Monthly Budget summary (amount used, remaining, and percentage used)

2. Add Income form

   - Amount (Euro €)

   - Date

   - Source (Salary, Freelance, Gift, Other)

   - Optional note

3. Add Expense form

   - Amount (Euro €)

   - Date

   - Category (Housing, Food, Transport, Bills, Shopping, Health, Study, Other)

   - Description / note

4. Set Monthly Budget

   - User can set a monthly spending limit

   - Show how much of the budget is used and remaining

5. Transaction History

   - List of all income and expense transactions

   - Ability to delete a transaction

   - Show date, type, category/source, amount, and note

Rules:

- All amounts in Euro (€)

- Never allow negative amounts

- Recalculate totals automatically when adding or deleting transactions

- Store all data in localStorage so it persists after refresh

- Remaining Balance = Total Income − Total Expenses

- Budget Remaining = Monthly Budget − Total Expenses

Layout:

- Top navigation with links: Dashboard, Add Income, Add Expense, Budget, History

- Clean and simple UI

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://expensetrackerfinal.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/385c5c1f-e6ba-5c68-bc00-b742e3d9bcb7).

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
