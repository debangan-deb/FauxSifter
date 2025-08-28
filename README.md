🛒 FauxSifter – Amazon Review Detector

FauxSifter is a mini-project that combines a Flask backend and a React frontend to help identify fake Amazon product reviews.

✨ Features

🔍 Paste any Amazon product link (/dp/ASIN)

🤖 Scrapes product reviews automatically using Playwright

🧠 Classifies reviews as REAL or FAKE with a trained SVM model

📊 Exports results in a styled Excel report (with product details & labels)

🌐 Frontend built with React + Bootstrap

🐍 Backend powered by Flask, Pandas, Scikit-learn, and Playwright

🚀 Deployment

Backend runs on Render (Docker + Gunicorn + Playwright)

Frontend hosted on Vercel (Create React App build)
