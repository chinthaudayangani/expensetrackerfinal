# Personal Expense Tracker — Product Requirements Document

## 1. Project Overview

- **Product name:** Personal Expense Tracker  
- **Product type:** Responsive web application  
- **Currency:** Euro (€)  
- **Design:** Modern, simple, clean, and beginner-friendly  

The Personal Expense Tracker helps individuals record income and expenses, organise spending, set a monthly budget, and understand their remaining balance.

## 2. Problem Statement

Many people do not record every purchase or income payment. As a result, they may lose track of where their money goes, exceed their monthly budget, or find it difficult to calculate how much money remains. Using notebooks or separate spreadsheets can be time-consuming.

## 3. Target Users

- Students who want to monitor their everyday spending  
- Employees who want to manage monthly income and expenses  
- Individuals who want a simple way to plan their personal budget  

## 4. Product Objectives

- Make it easy to record income and expenses  
- Organise transactions into useful categories  
- Show monthly income, expenses, and remaining balance  
- Help users compare spending with a monthly budget  
- Let users review previous transactions  

## 5. Main Features

### 5.1 Dashboard
Display total income, total expenses, remaining balance, and monthly budget for the selected month.

### 5.2 Add Income
Allow the user to enter an amount, date, income source, and optional note.

### 5.3 Add Expense
Allow the user to enter an amount, date, expense category, description, and optional note.

### 5.4 Categories
Provide simple categories such as Housing, Food, Transport, Bills, Shopping, Health, Study, and Other. Allow the user to select a category when recording a transaction.

### 5.5 Monthly Budget
Allow the user to set a monthly spending limit and see how much of it has been used and how much remains.

### 5.6 Transaction History
Show saved income and expense records, with the ability to review and delete a record.

## 6. Functional Requirements

- The user can add an income transaction  
- The user can add an expense transaction  
- Each transaction stores an amount, date, type, and description or category  
- The application displays all amounts in euros (€)  
- The dashboard calculates total income and total expenses  
- The remaining balance is calculated as total income minus total expenses  
- The user can set a monthly budget  
- The application shows the amount and percentage of the budget used  
- The user can view transaction history  

## 7. Basic Calculation Rules

- Remaining balance = Total income − Total expenses  
- Budget remaining = Monthly budget − Total expenses  
- All calculations should update when a transaction is added or deleted  
- The application should prevent empty or invalid amounts  
- Negative transaction amounts are not allowed  

## 8. User Workflow

1. The user opens the application dashboard  
2. The user adds income and/or expenses  
3. The user selects a category and enters the transaction details  
4. The application saves the transaction  
5. The dashboard updates totals and the remaining balance  
6. The user sets or reviews the monthly budget  
7. The user checks transaction history and spending  

## 9. MVP Scope

The first working version includes:

- Dashboard with income, expenses, balance, and budget summary  
- Add income  
- Add expense  
- Expense categories  
- Set monthly budget  
- Transaction history  

The first version focuses on one user’s personal records and EUR currency. It does not need bank connections, online payments, shared family accounts, or automatic bank transaction imports.

## 10. Future Improvements

- Charts by category  
- Recurring transactions  
- Downloadable monthly reports  
- Savings goals  
- Secure user accounts with cloud data storage  

## 11. Design Requirements

- Modern and simple visual style  
- Clear navigation and readable labels  
- White or light background with soft green accents  
- Responsive layout for desktop and mobile screens  
- Forms should be short and easy to understand  

## 12. Success Criteria

The prototype is successful if a user can:

- Add income  
- Add an expense  
- Set a monthly budget  
- View transaction history  
- See the dashboard totals and remaining balance update correctly
