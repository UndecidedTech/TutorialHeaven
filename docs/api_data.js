define({ "api": [
  {
    "type": "get",
    "url": "/catalog",
    "title": "Get Courses List",
    "name": "getCourses",
    "group": "Catalog",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "query",
            "description": "<p>String used for partial match regex search on Course names.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/catalog.js",
    "groupTitle": "Catalog"
  }
] });
