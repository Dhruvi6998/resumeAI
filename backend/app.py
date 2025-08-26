import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from sentence_transformers import SentenceTransformer, util
import pdfplumber
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all routes

# Upload folder
app.config['UPLOAD_FOLDER'] = 'uploads'

# Initialize model
model = SentenceTransformer('all-MiniLM-L6-v2')

# ✅ Utility function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

# ✅ Route to screen resumes
@app.route('/api/screen_resumes', methods=['POST'])
def screen_resumes():
    if 'jd' not in request.files or 'resumes' not in request.files:
        return jsonify({"error": "Job description and resumes files are required"}), 400

    # Save job description
    job_description_file = request.files['jd']
    jd_filename = secure_filename(job_description_file.filename)
    jd_path = os.path.join(app.config['UPLOAD_FOLDER'], jd_filename)
    job_description_file.save(jd_path)
    job_description_text = extract_text_from_pdf(jd_path)

    # Encode JD
    jd_embedding = model.encode(job_description_text, convert_to_tensor=True)

    relevant_resumes = []
    irrelevant_resumes = []

    # Process resumes
    resume_files = request.files.getlist('resumes')
    for resume_file in resume_files:
        resume_filename = secure_filename(resume_file.filename)
        resume_path = os.path.join(app.config['UPLOAD_FOLDER'], resume_filename)
        resume_file.save(resume_path)
        resume_text = extract_text_from_pdf(resume_path)

        # Encode resume and calculate similarity
        resume_embedding = model.encode(resume_text, convert_to_tensor=True)
        cosine_score = util.cos_sim(jd_embedding, resume_embedding).item()

        # Threshold
        if cosine_score > 0.4:
            relevant_resumes.append(resume_filename)
        else:
            irrelevant_resumes.append(resume_filename)

        # Delete resume file after processing
        os.remove(resume_path)

    # Delete JD file
    os.remove(jd_path)

    return jsonify({
        "relevant_resumes": relevant_resumes,
        "irrelevant_resumes": irrelevant_resumes
    })

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True, port=5000)  # ✅ Make sure this runs on port 5000
