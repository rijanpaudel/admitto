# Admitto

Complete platform helping Nepali students navigate studying in Canada - scholarships, visas, and job opportunities.

## 🚀 Tech Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Database:** Supabase (PostgreSQL + Vector Store)
- **Data Collection:** Python + BeautifulSoup
- **AI:** OpenAI GPT-4 with RAG (Retrieval Augmented Generation)

## 📁 Project Structure

nepali-abroad-helper/
├── frontend/ # Next.js application
│ ├── app/ # App Router pages
│ ├── lib/ # Utilities & Supabase client
│ └── components/ # React components
├── scripts/ # Python data collection scripts
│ ├── scrape_scholarships.py
│ ├── generate_embeddings.py
│ └── requirements.txt
├── database/ # SQL schemas
│ └── schema.sql
└── docs/ # Documentation


## 🛠️ Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- Supabase account
- OpenAI API key

### Installation

1. **Clone repository:**

git clone <your-repo-url>
cd nepali-abroad-helper

Fill in your Supabase and OpenAI credentials

npm run dev


3. **Setup Python Scripts:**

cd ../scripts
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

Fill in your credentials


4. **Setup Database:**
- Go to Supabase Dashboard → SQL Editor
- Run `database/schema.sql`

## 🚢 Deployment

- **Frontend:** Vercel (automatic with GitHub)
- **Database:** Supabase (managed)
- **Scripts:** GitHub Actions (scheduled) or local cron

## 📝 License

MIT

