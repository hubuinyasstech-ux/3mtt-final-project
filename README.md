# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Project setup (3MTT QR Attendance)

1. Copy `.env.example` to `.env` or `.env.local` and fill in your Supabase project values:

```bash
cp .env.example .env
# then edit .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

2. Install and run:

```bash
npm install
npm run dev
```

3. Database schema (Supabase) - create these tables or use the following SQL in the SQL editor:

```sql
create table if not exists public.students (
	id bigserial primary key,
	full_name text,
	matric_number text,
	email text,
	inserted_at timestamptz default now()
);
```

```sql
create table if not exists public.attendance (
	id bigserial primary key,
	student_id bigint references public.students(id),
	status text,
	created_at timestamptz default now()
);
```

-- attendance_sessions (used by GenerateQR)

```sql
create table if not exists public.attendance_sessions (
  id bigserial primary key,
  session_code text unique,
  title text,
  created_at timestamptz default now()
);
```

4. App notes:

- The app expects `students` and `attendance` tables (see SQL above). Optionally `attendance_sessions` is used by GenerateQR.
- Supabase keys are loaded from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env`.
- Pages implemented: Login, Register, Dashboard, Attendance, ScanQR, GenerateQR, Students.

5. Git / deploy notes

- Create a branch, commit your changes, and push:

```bash
git checkout -b feature/complete-app
git add .
git commit -m "feat: finish core app pages, auth and supabase integration"
git push -u origin feature/complete-app
```

- I can prepare a PR description if you want; tell me the branch name and target.

If you want, I can also produce additional SQL for `attendance_sessions` features or add CI workflow to build on push.
