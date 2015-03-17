#!/usr/bin/env python
# -*- coding: utf-8 -*-
  
import json
import urllib2
import pylast

username = "YourUserName"
API_KEY = "e91e0870f65e6cb22546c618781fed90" # this is a sample key
API_SECRET = "d2c1a23768b0786a6ac6fe63632b7919"
password_hash = pylast.md5("YourPassword")
limit = "200"
genre = "GenreTagAsFilter"

json_data = json.load(urllib2.urlopen("http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=" + username + "&api_key=" + API_KEY + "&format=json&limit=" + limit))  

# You have to have your own unique two values for API_KEY and API_SECRET
# Obtain yours from http://www.last.fm/api/account for Last.fm

# In order to perform a write operation you need to authenticate yourself

network = pylast.LastFMNetwork(api_key = API_KEY, api_secret = 
    API_SECRET, username = username, password_hash = password_hash)

for artist in json_data["topartists"]["artist"]:
	name = artist["name"]
	artistObj = network.get_artist(name)
	tags = artistObj.get_top_tags(3)
	for tag in tags:
		tagName = tag.item.get_name()
		if tagName.lower() == genre.lower():
			print name
