#!/usr/bin/python3
from bs4 import BeautifulSoup
import requests
page = requests.get("https://www.jardineiro.net/plantas-de-a-a-z-por-nome-popular")
#print(page.text)
soup = BeautifulSoup(page.text, 'html.parser')
#print(soup.prettify())
plantas = soup.select("div.pt-cv-gls-group > div.pt-cv-gls-content > div > div > div > div > div > div.pt-cv-ctf-value")
plantinhas = []
print('{')
for p in plantas:
    #print(''+p.get_text()+'</option>')
    print('         "'+p.get_text()+'": "'+p.get_text()+'",')
print('}')
