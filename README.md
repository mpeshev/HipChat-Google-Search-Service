# HipChat-Google-Search-Service

A simple self-hosted 3rd party node.js service for Google search integrated with HipChat

You can create a custom integration for HipChat and host that on a server of yours. By using `/google` (or another word defined by you) you could apply a search criteria sent to your server that would trigger a Google Search and pull the first result from the SERP.

A Custom Search Engine API key should be provided as well (that allows for up to 100 search queries for free). 

Set the variable arguments on top of the script (keyword, API key, URL), create a HipChat integration and you're good to go.
