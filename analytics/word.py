import re
import sys
import codecs
import numpy
from gensim.models import word2vec
from nltk.corpus import stopwords
from numpy import *
import pandas as pd
import gensim.models.keyedvectors as word2vec
from nltk.stem import PorterStemmer
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import sent_tokenize, word_tokenize


csvfile = sys.argv[1]
bDataFrame = pd.read_csv(csvfile).fillna('')
tweet = bDataFrame['text']
processed_tweet = []
for t in tweet:
    processed_tweet.append(t)
textp=' '.join(processed_tweet)
stemmed_tweet = []
ps = PorterStemmer()
lem = WordNetLemmatizer()
words = word_tokenize(textp)

for w in words:
        p= ps.stem(w)
        l = lem.lemmatize(w)
        stemmed_tweet.append(l)
text_review = ' '.join(stemmed_tweet)
#print(text_review)

# Google original vectors from Google News corpora
model = word2vec.KeyedVectors.load_word2vec_format('GoogleNews-vectors-negative300.bin', binary=True)


def text_to_wordlist(text, remove_stopwords=True):
 

    # Convert words to lower case and split them, clean stopwords from model' vocabulary
    words = text.lower().split()
    stopkey = [w.strip() for w in codecs.open('stopwords.txt', 'r').readlines()]
    meaningful_words = [w for w in words if not w in stopkey]
    return (meaningful_words)


# Function to get feature vec of words
def get_feature_vec(words, model):
    # Index2word is a list that contains the names of the words in the model's vocabulary. Convert it to a set, for speed 
    index2word_set = set(model.index2word)
    clean_text = []
    # vocabulary, add its feature vector to the total
    for word in words:
        if word in index2word_set:
            clean_text.append(model[word])

    return clean_text


# bag of word list without stopwords
clean_train_text = (text_to_wordlist(text_review))

# delete words which occur more than ones
clean_train = []
for words in clean_train_text:
    if words in clean_train:
        words = +1
    else:
        clean_train.append(words)

trainDataVecs = get_feature_vec(clean_train, model)
trainData = numpy.asarray(trainDataVecs)

# calculate cosine similarity matrix to use in pagerank algorithm for dense matrix, it is not fast for sparse matrix
# sim_matrix = 1-pairwise_distances(trainData, metric="cosine")

# similarity matrix, it is 30 times faster for sparse matrix

similarity = numpy.dot(trainData, trainData.T)

# squared magnitude of preference vectors (number of occurrences)
square_mag = numpy.diag(similarity)

# inverse squared magnitude
inv_square_mag = 1 / square_mag

# if it doesn't occur, set it's inverse magnitude to zero (instead of inf)
inv_square_mag[numpy.isinf(inv_square_mag)] = 0

# inverse of the magnitude
inv_mag = numpy.sqrt(inv_square_mag)

# cosine similarity (elementwise multiply by inverse magnitudes)
cosine = similarity * inv_mag
cosine = cosine.T * inv_mag


# pagerank powermethod
def powerMethod(A, x0, m, iter):
    n = A.shape[1]
    delta = m * (array([1] * n, dtype='float64') / n)
    for i in range(iter):
        x0 = dot((1 - m), dot(A, x0)) + delta
    return x0


n = cosine.shape[1]  # A is n x n
m = 0.15
x0 = [1] * n

pagerank_values = powerMethod(cosine, x0, m, 130)

srt = numpy.argsort(pagerank_values)
a = srt[0:20]

keywords_list = []

for words in a:
    keywords_list.append(clean_train_text[words])

frequency={}
for word in stemmed_tweet:
    if word in keywords_list:
        if word not in frequency:
            frequency[word]=1
        else:
            frequency[word]+=1
print(frequency)


