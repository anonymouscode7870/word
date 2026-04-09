#!/usr/bin/env python
# coding: utf-8

# In[45]:


import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.model_selection import train_test_split


# In[4]:


titanic = sns.load_dataset("titanic")


# In[5]:


titanic.head()


# In[6]:


titanic.info()


# In[9]:


titanic.isnull().sum()


# In[10]:


# let select some feature and work on it
feature = ["pclass", "sex", "fare", "embarked","age"]
target = ["survived"]


# In[11]:


# import the imputer to fill the missing values
from sklearn.impute import SimpleImputer


# In[18]:


# remove all null using imputer and replace with mean  median ,mode

# numerical data
imp_median = SimpleImputer(strategy="median")
titanic[["age"]] = imp_median.fit_transform(titanic[["age"]])

# categorical data
imp_freq1 = SimpleImputer(strategy="most_frequent")
titanic[["embarked"]] = imp_freq1.fit_transform(titanic[["embarked"]])

# categorical data
imp_freq2 = SimpleImputer(strategy="most_frequent")
titanic[["embark_town"]] = imp_freq2.fit_transform(titanic[["embark_town"]])

# categorical data
imp_freq3 = SimpleImputer(strategy="most_frequent")
titanic[["deck"]] = imp_freq3.fit_transform(titanic[["deck"]])


# In[19]:


titanic.isnull().sum()


# In[21]:


# now we do level encoder
titanic.head()


# In[29]:


from sklearn.preprocessing import LabelEncoder

le = LabelEncoder()
titanic["sex"] = le.fit_transform(titanic["sex"])
titanic["embarked"] = le.fit_transform(titanic["embarked"])


# In[32]:


titanic.head(300)


# In[33]:


# split features
X = titanic[feature]
y = titanic[target]


# In[35]:


X.head()


# In[36]:


y.head()


# In[37]:


X_train, X_test, y_train, y_test = train_test_split(
    X, y,test_size = 0.2 ,random_state = 42
)


# In[38]:


X_train.head()


# In[40]:


X_test.head()


# In[41]:


# decision tree model - no pruning
from sklearn.tree import DecisionTreeClassifier
model = DecisionTreeClassifier()
model.fit(X_train, y_train)


# In[42]:


y_pred = model.predict(X_test)


# In[43]:


from sklearn.metrics import f1_score, classification_report, confusion_matrix, accuracy_score
print("F1 score:", f1_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("\naccuracy_score:\n", accuracy_score(y_test, y_pred))


# In[48]:


# plot eecision tree
from sklearn.tree import plot_tree

plt.figure(figsize = (18,10))

plot_tree(
    model,
    feature_names = X.columns,
    class_names = ["Died", "Survived"],
    filled = True
)

plt.tight_layout()
plt.show()


# In[ ]:




