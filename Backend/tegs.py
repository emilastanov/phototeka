



def getTags(text):
    for word in text.split():
        if word[0] == '#':
            yield word
