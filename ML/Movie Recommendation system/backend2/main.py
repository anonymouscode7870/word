from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

# 1. LOAD DATA (This must happen so the 'movies' and 'similarity' variables exist)
try:
    movies = pickle.load(open('movies_list.pkl', 'rb'))
    similarity = pickle.load(open('similarity.pkl', 'rb'))
    print("Data loaded successfully!")
except Exception as e:
    print(f"Error loading pickle files: {e}")

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No data received"}), 400
        
    user_input = data.get('movie', '').strip()

    try:
        # 1. Try Exact Title Match first
        if user_input.lower() in movies['title'].str.lower().values:
            movie_index = movies[movies['title'].str.lower() == user_input.lower()].index[0]
            distances = similarity[movie_index]
            movie_indices = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:7]
            movie_indices = [i[0] for i in movie_indices]
            
        # 2. Fallback: Search in Tags/Genres
        else:
            mask = movies['tags'].str.contains(user_input, case=False, na=False) | \
                   movies['genres'].str.contains(user_input, case=False, na=False)
            
            results = movies[mask]
            
            if results.empty:
                # 3. Last Resort: Most popular
                movie_indices = movies.sort_values(by='vote_average', ascending=False).head(6).index.tolist()
            else:
                movie_indices = results.sort_values(by='vote_average', ascending=False).head(6).index.tolist()

        recommendations = []
        for i in movie_indices:
            row = movies.iloc[i]
            movie_data = row.to_dict()
            # Clean NaNs for JSON compatibility
            movie_data = {k: (None if pd.isna(v) else v) for k, v in movie_data.items()}
            recommendations.append(movie_data)
            
        return jsonify({"success": True, "recommendations": recommendations})

    except Exception as e:
        print(f"Internal Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

# 2. THE START COMMAND (This makes the .py file actually run)
if __name__ == "__main__":
    print("Server starting on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)