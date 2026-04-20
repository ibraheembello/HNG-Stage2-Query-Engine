# Insighta Labs - Intelligence Query Engine

A demographic intelligence API that supports advanced filtering, sorting, pagination, and natural language querying of user profiles.

## Table of Contents
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Natural Language Parsing](#natural-language-parsing)
- [Deployment on Vercel](#deployment-on-vercel)
- [Local Setup](#local-setup)
- [Technologies Used](#technologies-used)

## Features
- **Advanced Filtering**: Filter by gender, age group, country, and probability scores.
- **Sorting**: Sort results by age, creation date, or gender probability.
- **Pagination**: Paginated responses with customizable limits.
- **Natural Language Search**: Query data using plain English (e.g., "young males from nigeria").
- **Seeded Data**: Pre-loaded with 2026 demographic profiles.

## API Endpoints

### 1. Get All Profiles
`GET /api/profiles`

**Query Parameters:**
- `gender`: `male` | `female`
- `age_group`: `child` | `teenager` | `adult` | `senior`
- `country_id`: ISO 2-letter code (e.g., `NG`)
- `min_age`, `max_age`: Numeric age range
- `min_gender_probability`, `min_country_probability`: Confidence thresholds
- `sort_by`: `age` | `created_at` | `gender_probability`
- `order`: `asc` | `desc`
- `page`, `limit`: Pagination controls

### 2. Natural Language Query
`GET /api/profiles/search?q=<query>`

**Example:** `/api/profiles/search?q=young males from nigeria`

## Natural Language Parsing

### Approach
The parser uses a **rule-based regular expression engine** to identify specific keywords and patterns in the query string and map them to database filters. This approach ensures high performance and predictability without the overhead of an LLM.

### Supported Keywords & Mappings
| Keyword | Logic / Mapping |
|---------|-----------------|
| `young` | `min_age=16` AND `max_age=24` |
| `males` / `male` | `gender=male` |
| `females` / `female` | `gender=female` |
| `above <X>` | `min_age=X+1` |
| `from <country_id>` | `country_id=<ID>` (e.g., "from NG") |
| `from <country_name>` | Maps full country names to ISO codes (e.g., "Nigeria" -> "NG") |
| `child` / `children` | `age_group=child` |
| `teenagers` | `age_group=teenager` |
| `adults` | `age_group=adult` |
| `seniors` | `age_group=senior` |

### Logic Workflow
1. Convert query to lowercase.
2. Execute a series of regex checks for gender, age groups, and "young" status.
3. Extract age thresholds from patterns like "above 30".
4. Search for country names or "from [ISO code]" patterns.
5. Combine all identified filters into a single database query.
6. Apply pagination (page/limit) to the resulting filter set.

### Limitations
- **Complex Conjunctions**: Does not currently handle "OR" logic (e.g., "males OR females"). It assumes "AND" for all identified filters.
- **Negative Filters**: Does not support "not" (e.g., "people not from Nigeria").
- **Relative Ranges**: Does not support "between X and Y" or "below X" (except for the predefined "young" range).
- **Misspellings**: Exact keyword matches are required; fuzzy matching is not implemented.
- **Ambiguity**: If a query contains conflicting terms (e.g., "male and female"), the last matched gender will typically take precedence or they may conflict depending on regex order.

## Deployment on Vercel

Follow these steps to deploy the Intelligence Query Engine to Vercel:

### 1. Database Setup
- Provision a PostgreSQL database (e.g., using Supabase, Neon, or Aiven).
- Copy the Connection String (URI).

### 2. Prepare for Vercel
- Ensure `prisma/schema.prisma` is present.
- Ensure `package.json` has the `postinstall` script: `"postinstall": "prisma generate"`.
- Create a `vercel.json` in the root (optional, but recommended for Express):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

### 3. Deploy via Vercel CLI or Dashboard
- **Dashboard**: Import your GitHub repository.
- **Environment Variables**: Add `DATABASE_URL` with your PostgreSQL connection string.
- **Build & Deploy**: Vercel will run `npm install`, then `prisma generate`, and deploy the server.

### 4. Run Seeding
Since Vercel is serverless, you should run the seed script locally once or via a GitHub Action to populate your production database:
```bash
DATABASE_URL="your_prod_db_url" npm run seed
```

## Local Setup
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up your `.env` file with `DATABASE_URL`.
4. Generate Prisma client: `npx prisma generate`.
5. Run migrations (or `db push` for quick setup): `npx prisma db push`.
6. Seed the database: `npm run seed`.
7. Start the dev server: `npm run dev`.

## Technologies Used
- **Node.js** & **TypeScript**
- **Express.js** (Server Framework)
- **Prisma** (ORM)
- **PostgreSQL** (Database)
- **UUID v7** (Primary Keys)
