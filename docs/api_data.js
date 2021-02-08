define({ "api": [
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./docs/main.js",
    "group": "C:\\Users\\tbart\\Desktop\\Senior Design\\TutorialHeaven\\docs\\main.js",
    "groupTitle": "C:\\Users\\tbart\\Desktop\\Senior Design\\TutorialHeaven\\docs\\main.js",
    "name": ""
  },
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
  },
  {
    "type": "post",
    "url": "/catalog",
    "title": "Join Course",
    "name": "joinCourse",
    "group": "Catalog",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "courseID",
            "description": "<p>String used to retrieve course based on id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/catalog.js",
    "groupTitle": "Catalog"
  },
  {
    "type": "get",
    "url": "/getCourse/:courseID",
    "title": "Get CourseID",
    "name": "courseID",
    "group": "Courses",
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
    "filename": "./routes/courses.js",
    "groupTitle": "Courses"
  },
  {
    "type": "post",
    "url": "/createAssessmentContent",
    "title": "Create Assessment Content",
    "name": "createAssessmentContent",
    "group": "Courses",
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
    "filename": "./routes/courses.js",
    "groupTitle": "Courses"
  },
  {
    "type": "post",
    "url": "/createCourse",
    "title": "Create Course",
    "name": "createCourse",
    "group": "Courses",
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
    "filename": "./routes/courses.js",
    "groupTitle": "Courses"
  },
  {
    "type": "post",
    "url": "/createModule",
    "title": "Create Module",
    "name": "createModule",
    "group": "Courses",
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
    "filename": "./routes/courses.js",
    "groupTitle": "Courses"
  },
  {
    "type": "post",
    "url": "/createModuleContent",
    "title": "Create Module Content",
    "name": "createModuleContent",
    "group": "Courses",
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
    "filename": "./routes/courses.js",
    "groupTitle": "Courses"
  },
  {
    "type": "post",
    "url": "/createSection",
    "title": "Create Section",
    "name": "createSection",
    "group": "Courses",
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
    "filename": "./routes/courses.js",
    "groupTitle": "Courses"
  },
  {
    "type": "post",
    "url": "/deleteAssessmentContent",
    "title": "Delete Assessment Content",
    "name": "deleteAssessmentContent",
    "group": "Courses",
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
    "filename": "./routes/courses.js",
    "groupTitle": "Courses"
  },
  {
    "type": "post",
    "url": "/deleteModule",
    "title": "Delete Modeule",
    "name": "deleteModule",
    "group": "Courses",
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
    "filename": "./routes/courses.js",
    "groupTitle": "Courses"
  },
  {
    "type": "post",
    "url": "/deleteModuleContent",
    "title": "Delete Module Content",
    "name": "deleteModuleContent",
    "group": "Courses",
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
    "filename": "./routes/courses.js",
    "groupTitle": "Courses"
  },
  {
    "type": "post",
    "url": "/deleteSection",
    "title": "Delete Section",
    "name": "deleteSection",
    "group": "Courses",
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
    "filename": "./routes/courses.js",
    "groupTitle": "Courses"
  },
  {
    "type": "put",
    "url": "/updateAssessmentContent",
    "title": "Update Assessment Content",
    "name": "updateAssessmentContent",
    "group": "Courses",
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
    "filename": "./routes/courses.js",
    "groupTitle": "Courses"
  },
  {
    "type": "put",
    "url": "/updateCourse",
    "title": "Update Course",
    "name": "updateCourse",
    "group": "Courses",
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
    "filename": "./routes/courses.js",
    "groupTitle": "Courses"
  },
  {
    "type": "put",
    "url": "/updateModule",
    "title": "Update Modeule",
    "name": "updateModule",
    "group": "Courses",
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
    "filename": "./routes/courses.js",
    "groupTitle": "Courses"
  },
  {
    "type": "put",
    "url": "/updateModuleContent",
    "title": "Update Module Content",
    "name": "updateModuleContent",
    "group": "Courses",
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
    "filename": "./routes/courses.js",
    "groupTitle": "Courses"
  },
  {
    "type": "put",
    "url": "/updateSection",
    "title": "Update Section",
    "name": "updateSection",
    "group": "Courses",
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
    "filename": "./routes/courses.js",
    "groupTitle": "Courses"
  },
  {
    "type": "post",
    "url": "/image-upload",
    "title": "Upload Image",
    "name": "image-upload",
    "group": "Images",
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
    "filename": "./routes/images.js",
    "groupTitle": "Images"
  },
  {
    "type": "post",
    "url": "/reset/:token",
    "title": "Reset Token",
    "name": "emailToken",
    "group": "Users",
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
    "filename": "./routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/forgot",
    "title": "Forgot Password",
    "name": "forgotPassword",
    "group": "Users",
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
    "filename": "./routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/profile/:userId",
    "title": "Get User ID",
    "name": "getUserId",
    "group": "Users",
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
    "filename": "./routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/profile",
    "title": "Profile",
    "name": "profile",
    "group": "Users",
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
    "filename": "./routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/saveAssessment",
    "title": "Save Assessment",
    "name": "saveAssessment",
    "group": "Users",
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
    "filename": "./routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/signin",
    "title": "Sign In",
    "name": "signIn",
    "group": "Users",
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
    "filename": "./routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/signup",
    "title": "Sign Up",
    "name": "signUp",
    "group": "Users",
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
    "filename": "./routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/submitAssessment",
    "title": "Submit Assessment",
    "name": "submitAssessment",
    "group": "Users",
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
    "filename": "./routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/reset/:token",
    "title": "Get Reset Token",
    "name": "token",
    "group": "Users",
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
    "filename": "./routes/users.js",
    "groupTitle": "Users"
  }
] });
