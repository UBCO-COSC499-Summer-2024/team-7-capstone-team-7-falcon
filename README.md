[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15118758&assignment_repo_type=AssignmentRepo)

# Optical Marking Management System 
### Team 7 Falcon

## Project Description
* Project goal: To create a responsive web application that supports the marking and management of optically marked exams.  The application will allow for the rapid construction, marking, analysis and return of optically marked exams.
* Target users:
    * Instructors: Require the ability to create classes, exams (events and bubble sheets, exam events, load exams (upload a pdf scan of bubble sheets, parse scan sheets, mark and review sheets.   
        * They be able to run statistics on exams and allow students to view their marked exams. Visualizations will make it easy to determine current performance and appropriate benchmarks or comparators could be used to motivate performance.    Instructors will be able to look at year over year analysis for course.
        * They need to be able to download results for given exams.
    * Students: must be able to view the results of instances on an exam for a course. They will be only available to review their exam(s) during the time interval for the course.
    * Administrator: Requires the ability to maintain and manage the system
* Things to think about when scoping your project:This list is non-exhaustive. It is only meant to get you thinking about the variety of ways you may choose to scope and design this project.
   * How will users login to the system? (security and authentication)
   * How will accounts be created?
   * As the system would be considered ‘extra work’ for instructors, how to make it most efficient for data entry and quick glance reporting/analytics?
   * How will the database be designed to support new exams or formats of bubble sheets? It is anticipated that the system will need to be able to handle a number of different ways of marking and analyzing questions.
   * The system will not have a high number of instructors but potentially a large number of students and data. How to optimize for ease of use and maintainability? What about data security?
   * What can be done to make this system easy to use especially for first time users?
   * Ideally instructors have limited interaction with the system except for some exam creation, data entry and reporting. What can be done to streamline the onboarding process and recall when using the system. 
   * There is a variety of data that could be available on an exam. What other data would be useful to understand exam performance?
   * It is expected that the web app will be almost entirely used on desktop computers from the instructors and administrators view. Student view should support both desktop and mobile.
   * What needs to be done to adhere to relevant privacy regulations and guidelines to ensure student data protection.

---

Please use the provided folder structure for your docs (project plan, design documenation, communications log, weekly logs and final documentation), source code, tesing, etc.    You are free to organize any additional internal folder structure as required by the project.  The team **MUST** use a branching workflow and once an item is ready, do remember to issue a PR, review and merge in into the master brach.
```
.
├── docs                    # Documentation files (alternatively `doc`)
│   ├── TOC.md              # Table of contents
│   ├── plan                # Scope and Charter
│   ├── design              # Getting started guide
│   ├── final               # Getting started guide
│   ├── logs                # Team Logs
│   └── ...
├── build                   # Compiled files (alternatively `dist`))    
├── app                     # Source files (alternatively `lib` or `src`)
├── test                    # Automated tests (alternatively `spec` or `tests`)
├── tools                   # Tools and utilities
├── LICENSE                 # The license for this project 
└── README.md
```
You can find additional information on folder structure convetions [here](https://github.com/kriasoft/Folder-Structure-Conventions). 

Also, update your README.md file with the team and client/project information.  You can find details on writing GitHub Markdown [here](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) as well as a [handy cheatsheet](https://enterprise.github.com/downloads/en/markdown-cheatsheet.pdf).   
