# QR Attendance System

A school management web application that uses QR codes to simplify student attendance.

## Features

Student registration and login
Supabase authentication
Student profiles
Dashboard
QR-code generation
QR-code scanning
Attendance sessions and records
Responsive interface
User roles

## Tech Stack

React + Vite
React Router DOM
Tailwind CSS
Supabase Auth + PostgreSQL
react-qr-code for QR generation
html5-qrcode for QR scanning

## Main Pages

Login
Register
Dashboard
Attendance
GenerateQR
ScanQR

## Project Structure

src/
├── components/
├── context/
├── pages/
│ ├── Login.jsx
│ ├── Register.jsx
│ ├── Dashboard.jsx
│ ├── Attendance.jsx
│ ├── GenerateQR.jsx
│ └── ScanQR.jsx
├── services/
│ └── supabase.js
├── App.jsx
├── index.jsx
└── index.css

## Installation

Install dependencies:

npm install
Required packages include:
npm install react-router-dom @supabase/supabase-js react-qr-code html5-qrcode

## Supabase Configuration

Create a .env file in the project root:

VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

Example Supabase client:

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
supabaseUrl,
supabaseAnonKey
);

Do not commit .env or expose a Supabase service-role key in the React
frontend.

## Database Structure

## Supabase Auth

Authentication credentials are managed by:

## auth.users

Passwords must not be stored in public.users.

### public.users

Recommended profile table:

Column Type Required Purpose

id uuid Yes Matches auth.users.id
full_name text Yes Student name
matric_number text Yes Student matric number
email text Yes Student email
role text Yes Default: student
created_at timestamptz Yes Registration time

## Registration

Registration uses Supabase Auth:

const { data, error } = await supabase.auth.signUp({
email: formData.email,
password: formData.password,
options: {
data: {
full_name: formData.fullName,
matric_number: formData.matricNumber,
},
},
});

The password is handled by Supabase Auth. The profile table stores the
student's profile information, not the password.

## Attendance Workflow

Student Login
↓
Attendance Session
↓
QR Code Generated
↓
Student Scans QR Code
↓
Attendance Verified
↓
Attendance Saved to Supabase
↓
Dashboard / Attendance Records

## Run the Project

Start the development server:
npm run dev

Vite normally runs at:
To allow other devices on the same network to access the app:
npm run dev -- --host
Production Build
npm run build
Preview the build:
npm run preview

## Troubleshooting

Registration succeeds but public.users is empty

Check:
The user exists in Supabase Authentication → Users.
The profile creation code or database trigger is working.
auth.users.id matches public.users.id.
full_name and matric_number are supplied.
RLS policies permit the required operation.
Check Auth:

select
id,
email,
raw_user_meta_data,
created_at
from auth.users
where email = 'YOUR_EMAIL';

Check the profile:
select
id,
full_name,
matric_number,
email,
role,
created_at
from public.users
where email = 'YOUR_EMAIL';

Error 23502: null value in column "full_name"
This means a profile insert was attempted without full_name.
Make sure registration sends:
full_name: formData.fullName
and that any database function reads the Auth metadata correctly.
Login says "Invalid login credentials"
Check:
Email and password are correct.
The user exists in Supabase Auth.
The app is connected to the correct Supabase project.
Email confirmation settings are configured appropriately.

Login says "Unable to fetch"
The Auth account can exist even when its row in public.users is
missing.

### Verify

auth.users.id === public.users.id
Also check the browser console for the exact Supabase error.

Password column exists in public.users
Passwords should be managed by Supabase Auth. The application should not
store plain-text passwords in public.users.

If the old password column is no longer needed:
alter table public.users
drop column if exists password;
Only run this after confirming no application code depends on that
column.

## Security

Never store plain-text passwords in public.users.
Use Supabase Auth for authentication.
Never put a service-role key in the React frontend.
Keep .env out of Git.
Enable and configure Row Level Security (RLS).
Restrict attendance operations to authenticated users.
Validate user input before database operations.
Final Project Checklist

## Registration works

User appears in Supabase Auth
User profile appears in public.users
Password is not stored in public.users
Login works
Dashboard loads
QR generation works
QR scanning works
Attendance is saved
Attendance records display
Logout works
No major browser-console errors
npm run build succeeds

## Future Improvements

Admin dashboard
Lecturer/teacher accounts
Attendance reports
Course/date filtering
PDF/Excel export
Student attendance history
Statistics and charts
Role-based access control
Email notifications

## Author

QR Attendance System --- Final Project
Built with React, Vite, Tailwind CSS, and Supabase.
