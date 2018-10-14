# -*- coding: utf-8 -*-
"""
Created on Sat Oct 13 15:38:48 2018

@author: admin
"""
import os
import json
import requests
import re
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0

#no pdf and course number
google_api_key = "&api_key=AIzaSyCskp8mS42OgyC_g86gHdRqDMPra3sKwfE"


dir_path = os.path.dirname(os.path.realpath(__file__))
print("current directory: "+dir_path)

url_browser_re_pattern = '<div class="r">(?: )*<a href="'+"([A-Z]|[a-z]|\:|\/|\.|\~|[0-9]|_|\-)*"+'"(?: )*ping="'
#only work in browser

url_re_html_pattern = "(https?:\/\/(?:[A-Z]|[a-z]|\:|\/|\.|\~|[0-9]|_|\-)*.html)"
url_re_pdf_pattern = "(https?:\/\/(?:[A-Z]|[a-z]|\:|\/|\.|\~|[0-9]|_|\-)*.pdf)"

def google_url_grabber(keywords, school_name, page_name = 2):
    
    ##########################################################
    # extract relevant course links under specific school
    #   keywords: user entry course name
    #   school_name:
    #        ["cmu", "mit", "mit_open", "yale", "harvard", "caltech", "upenn", "standford", "brown", "edx"]
    #   page_name: search through how many pages (default 2)
    # return two list of url_links in string types: pdf / html
    # also return searched school domain for future reference
    ##########################################################
    
    keywords = keywords + " course"
    if (school_name == "cmu"):
        q = keywords+" site:cmu.edu/~"
        domain = "cmu.edu/~"
    if (school_name == "mit_open"): # open course
        q = keywords+" site:ocw.mit.edu"
        domain = "ocw.mit.edu"
    if (school_name == "mit"):
        q = keywords+" site:mit.edu/~"
        domain = "mit.edu/~"
    if (school_name == "caltech"):
        q = keywords+" site:caltech.edu/~"
        domain = "caltech.edu/~"
    if (school_name == "standford"):
        q = keywords+" site:standford.edu/~"
        domain = "standford.edu/~"
    if (school_name == "upenn"):
        q = keywords+" site:upenn.edu/~"
        domain = "upenn.edu/~"
    if (school_name == "yale"): # open course
        q = keywords+" site:oyc.yale.edu"
        domain = "oyc.yale.edu"
    if (school_name == "harvard"): # open course
        q = keywords+" site:online-learning.harvard.edu"
        domain = "online-learning.harvard.edu"
    if (school_name == "brown"): 
        q = keywords+" site:canvas.brown.edu/courses/"
        domain = "canvas.brown.edu/courses/"
    if (school_name == "edx"):
        q = keywords+" site:www.edx.com"
        domain = "www.edx.com"
    #url = 'http://https://api.duckduckgo.com/?q='+q+'&format=json'
    url = "https://google.com/search?q="+q 
    
    try:
        driver = webdriver.Firefox()
    except:
        print ("WebDriverException: 'geckodriver' executable needs to be in PATH." )
        #print ("You need to install geckodriver.exe (or whatever in unix) under enviorment path." )
        #print ("enviorn path: "+os.environ['PATH'])
        #print ("YOU can find latest version 'geckodriver' executable here https://github.com/mozilla/geckodriver/releases")
        
    #resp = requests.get(url=url, params=params)
    urls_html_list = []
    urls_pdf_list = []
    for pg in range(1,page_name+1):
        url_page = url + "&start="+str(pg*10)
        
        #python requests
        #page = requests.get(url=url_page)
       
        #browser driver
        driver.get(url_page)
        page = driver.page_source
        
        #python requests
        #urls_html = re.findall(url_re_html_pattern, str(page.content))
        #browser driver
        urls_html = re.findall(url_re_html_pattern, str(page))
        print(keywords+" html url unfound under "+school_name)
        urls_html = []
            
        remov_dup = set(urls_html)
        urls_html_list.extend(list(remov_dup))
        
        #python requests
        #urls_html = re.findall(url_re_pdf_pattern, str(page.content))
        #browser driver
        urls_pdf = re.findall(url_re_pdf_pattern, str(page))
        print(keywords+" pdf url unfound under "+school_name)
        urls_pdf = []
            
        remov_dup = set(urls_pdf)
        urls_pdf_list.extend(list(remov_dup))
        
        #print(page)
        
     
    return urls_pdf_list, urls_html_list, domain


        
        
    
    
    