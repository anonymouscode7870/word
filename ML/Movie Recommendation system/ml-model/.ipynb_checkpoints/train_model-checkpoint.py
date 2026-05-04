import pandas as pd
import ast
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle

movies = pd.read_csv('tmdb_5000_movies.csv')

# Function to convert JSON string to a clean list of names
def convert(obj):
    L = []
    for i in ast.literal_eval(obj):
        L.append(i['name'])
    return L

# 1. Clean Genres and Keywords
movies['genres'] = movies['genres'].apply(convert)
movies['keywords'] = movies['keywords'].apply(convert)

# 2. Clean Overview (turn string into list of words)
movies['overview'] = movies['overview'].apply(lambda x: x.split() if isinstance(x, str) else [])

# 3. Create a clean Tags column
# We combine Overview + Genres + Keywords
movies['tags'] = movies['overview'] + movies['genres'] + movies['keywords']
movies['tags'] = movies['tags'].apply(lambda x: " ".join(x).lower())

# 4. Create a clean version for the UI
# We keep numeric columns for the "All Parameters" request
final_df = movies[['id', 'title', 'tags', 'vote_average', 'release_date', 'runtime', 'budget', 'revenue', 'tagline', 'homepage', 'genres']]

# Ensure genres is a string for the frontend
final_df['genres'] = final_df['genres'].apply(lambda x: ", ".join(x))

# 5. ML Vectorization
cv = CountVectorizer(max_features=5000, stop_words='english')
vectors = cv.fit_transform(final_df['tags']).toarray()
similarity = cosine_similarity(vectors)

# 6. Save
pickle.dump(final_df, open('movies_list.pkl', 'wb'))
pickle.dump(similarity, open('similarity.pkl', 'wb'))

print("Success! Data is cleaned and model is trained.")