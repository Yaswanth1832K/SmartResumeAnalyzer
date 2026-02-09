import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import PyPDF2
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB limit

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Download NLTK data (if not present)
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('transformers/punkt_tab')
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('punkt')
    nltk.download('punkt_tab')
    nltk.download('stopwords')

# Expanded Skill Database
SKILLS_DB = [
    # Programming Languages
    "python", "java", "c", "c++", "javascript", "typescript", "ruby", "php", "swift", "kotlin", "go", "rust", "scala", "r", "matlab",
    
    # Web Frameworks & Libraries
    "react", "angular", "vue", "next.js", "nuxt", "svelte", "express", "node.js", "django", "flask", "fastapi", "spring boot", "asp.net", "ruby on rails", "laravel", "bootstrap", "tailwind css", "jquery",
    
    # Database
    "sql", "mysql", "postgresql", "mongodb", "cassandra", "redis", "elasticsearch", "firebase", "sqlite", "oracle", "dynamodb",
    
    # DevOps & Cloud
    "aws", "azure", "google cloud", "docker", "kubernetes", "jenkins", "gitlab ci", "github actions", "terraform", "ansible", "circleci", "heroku", "netlify", "vercel",
    
    # AI/ML & Data Science
    "machine learning", "deep learning", "nlp", "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy", "matplotlib", "seaborn", "opencv", "hadoop", "spark", "tableau", "power bi",
    
    # Tools & Others
    "git", "github", "gitlab", "jira", "trello", "bitbucket", "linux", "unix", "bash", "agile", "scrum", "rest api", "graphql", "websocket", "microservices", "testing", "jest", "cypress", "selenium", "data structures", "algorithms", "object oriented programming", "system design"
]

def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(filepath):
    """Extract text from a PDF file."""
    text = ""
    with open(filepath, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text

def preprocess_text(text):
    """Clean and preprocess text."""
    text = text.lower()
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    # Tokenize
    tokens = word_tokenize(text)
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word not in stop_words]
    return " ".join(filtered_tokens)

def extract_skills(text):
    """Detect skills present in the text."""
    found_skills = set()
    text_lower = text.lower()
    for skill in SKILLS_DB:
        # Improved regex for skill matching (word boundary + potential special chars handling)
        # Escaping skill to safely handle C++, C#, Node.js etc.
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.add(skill)
    return list(found_skills)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            extracted_text = extract_text_from_pdf(filepath)
            # Clean up the file after extraction if you don't want to store it permanently
            # os.remove(filepath) 
            return jsonify({"text": extracted_text}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    return jsonify({"error": "Invalid file type. Only PDF allowed."}), 400

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    data = request.json
    resume_text = data.get('resume_text', '')
    job_description = data.get('job_description', '')
    
    if not resume_text or not job_description:
        return jsonify({"error": "Both resume text and job description are required."}), 400

    # 1. Preprocess
    clean_resume = preprocess_text(resume_text)
    clean_jd = preprocess_text(job_description)
    
    # 2. Skill Detection
    resume_skills = set(extract_skills(resume_text))
    jd_skills = set(extract_skills(job_description))
    
    matched_skills = list(resume_skills.intersection(jd_skills))
    missing_skills = list(jd_skills - resume_skills)
    
    # 3. Hybrid Scoring Logic
    # Component A: Skill Match Ratio (Weighted 70%)
    if len(jd_skills) > 0:
        skill_match_score = (len(matched_skills) / len(jd_skills)) * 100
    else:
        skill_match_score = 0 

    # Component B: Semantic Similarity (Weighted 30%)
    # Helps capture context and soft skills not in DB
    corpus = [clean_resume, clean_jd]
    vectorizer = TfidfVectorizer()
    try:
        tfidf_matrix = vectorizer.fit_transform(corpus)
        semantic_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0] * 100
    except Exception:
        semantic_score = 0.0

    # Final Weighted Score (Adjust weights as needed)
    # If no skills in JD, rely 100% on semantic
    if len(jd_skills) > 0:
        final_score = (0.7 * skill_match_score) + (0.3 * semantic_score)
    else:
        final_score = semantic_score

    match_percentage = round(final_score, 2)

    # 4. Suggestions
    suggestions = []
    
    if match_percentage < 40:
        suggestions.append("Resume is not aligned with the job description. Focus on including keywords from the JD.")
    elif 40 <= match_percentage <= 75:
        suggestions.append("Resume partially matches. You have some relevant skills, but key requirements are missing.")
    else:
        suggestions.append("Excellent match! Your profile is highly relevant.")

    if missing_skills:
        suggestions.append(f"CRITICAL GAP: Your resume is missing the following high-priority skills found in the job description: {', '.join(missing_skills[:5])}.")
        suggestions.append("Action: Add a 'Skills' section or mention these in your project descriptions.")
    
    if len(resume_skills) < 5:
        suggestions.append("Formatting Alert: Verified skills count is low. Ensure your resume is not image-based and uses standard headings.")

    response = {
        "match_percentage": match_percentage,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": " ".join(suggestions)
    }
    
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
