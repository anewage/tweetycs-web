
    
#!/usr/bin/python
# coding=utf-8
import sys,codecs
import pandas as pd
import numpy as np
from sklearn import feature_extraction
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.feature_extraction.text import CountVectorizer
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.stem import PorterStemmer


def dataPrepos(text, stopkey):
    l = []
    words = text.split()
    for i in words:
        if i not in stopkey:  # stopwords
            l.append(i)
    return l

# tf-idf
def getKeywords_tfidf(data,stopkey,topK):

    idList =data['id']
    tweet = data['text']
    processed_tweet = []
    lem = WordNetLemmatizer()
    s = PorterStemmer()
    for t in tweet:
        processed_tweet.append(t)
    textp=' '.join(processed_tweet)
    words = textp.lower().split()
    meaningful_words = [w for w in words if not w in stopkey]
    textf=' '.join(meaningful_words)
    words = word_tokenize(textf)
    l = []
    for i in words:
        m = lem.lemmatize(i)
        l.append(m)

    textm=' '.join(l)
    corpus=[]
    corpus.append(textm) 

    #construct the vector
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(corpus) 
    #Calculate the TF-IDF
    transformer = TfidfTransformer()
    tfidf = transformer.fit_transform(X)
    # Get the keyword
    word = vectorizer.get_feature_names()
    # To get the keyword
    weight = tfidf.toarray()

    # Print the weight
    ids, texts, keys = [], [], []
    for i in range(len(weight)):
        ids.append(idList[i])
        df_word,df_weight = [],[] #  All the words and weights
        for j in range(len(word)):
            # print (word[j],weight[i][j])
            df_word.append(word[j])
            df_weight.append(weight[i][j])
        df_word = pd.DataFrame(df_word,columns=['word'])
        df_weight = pd.DataFrame(df_weight,columns=['weight'])
        word_weight = pd.concat([df_word, df_weight], axis=1) #
        word_weight = word_weight.sort_values(by="weight",ascending = False) # sort
        print(word_weight)
        keyword = np.array(word_weight['word']) 
        word_split = [keyword[x] for x in range(0,topK)] 

    frequency={}
    for word in textm.split():
        if word in word_split:
            if word not in frequency:
                frequency[word]=1
            else:
                frequency[word]+=1
    print(frequency)
    result = pd.DataFrame({"key": word_split},columns=['key'])
    return result


def main():
    csvfile = sys.argv[1]
    # read the file
    data = pd.read_csv(csvfile).fillna('')
    # Get the stopwords
    stopkey = [w.strip() for w in codecs.open('stopwords.txt', 'r').readlines()]
    # extract the tf-idf keyword
    result = getKeywords_tfidf(data,stopkey,100)
    result.to_csv("keys_TFIDF.csv",index=False)

if __name__ == '__main__':
    main()
