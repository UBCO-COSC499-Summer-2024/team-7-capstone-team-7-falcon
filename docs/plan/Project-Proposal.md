Team Number: 7

Team Members: Francisco, Dima, Paula, Ishika, Bennett

---
## Overview:

### Project purpose or justification (UVP)

The optical marking management system aims to provide educators with a robust, efficient, and accurate tool for digitally creating, administering, and automatically parsing and grading scanned bubble-sheet exams.

#### Unique Value Proposition

The unique value proposition of our optical marking management system lies in its ability to deliver fast, efficient, and highly accurate grading, drastically reducing the time and errors associated with manual processes. In addition, the system also allows instructors to customize bubble-sheet exams and process existing formats. Hence, our system is a versatile, scalable, and cost-effective solution for modern educational environments.

#### Why is our solution better than others?

- Our system utilizes a pre-trained Optical Mark Recognition (OMR) model to ensure highly accurate reading of bubble-sheet exams.
  - The performance evaluation dashboard provides current grades and leverages historical performance data for actionable insights.
  - The system is tolerant of user error in cases where the exam sheets are scanned with incorrect orientation.
  - The authentication in the system allows multiple ways to create user accounts.

### High-level project description and boundaries

The Optical Marking Management System's minimum viable product will be a responsive web application that allows instructors to create, modify, and grade bubble sheet exams with optical recognition. In addition, instructors will be able to visualize exam results with historical data through charts. Students can see their submissions as a digital version of the bubble sheet. 

#### In Scope:

1. Account Management System:

  - Users will be able to log in and create accounts using a modular system that allows multiple authentication methods. The application will support an option to create and sign in with Google OAuth and regular email & password methods.
  - Access to various system features will be restricted based on the user account's assigned role.

2. Course Management System:

  - Instructors can create and manage their courses.
  - Students can join the course using an invite link provided by the instructor.

3. Exams creation and management system:

  - Instructors will be able to create exams.
  - Upload bubble sheet exams for optical recognition grading.
  - Create bubble-sheet exams with a customizable number of questions and answers, allowing individual points assignment for each question.
  - Students can view their scores and the digital version of the exam.

4. Analytics

  - Instructors will be able to view individual and overall performance and exam statistics.
  - Compare data across different exams.
  - Ability to compare data with past performance of students.
  - Instructors can export exam results.

5. System Administration

  - Administrators will be able to change the role of user accounts.
  - Administrators will be able to create semester terms for the courses.

6. Privacy and storage of data

  - Exam files will be archived in the system one year after the semester has ended.
  - Users will only be able to view their own submissions.

7. Responsive Design:

  - The application and user interfaces will be able to support desktop and mobile devices.

#### Out-of-Scope:

1. Authentication:

  - Integration of authentication system from institutions (i.e., SSO with CWL).
  - Additional security features such as multi-factor authentication, security questions, or biometrics.

2. Charts and Analytics Customization:

  - Ability to create custom charts or metrics.
  - Ability to modify existing charts.

3. Integration with third-party Providers:

  - Exporting exam results and/or grades in a format suitable for third-party applications (i.e., Canvas).
  - Importing students’ or course information from third-party applications.

4. Accessibility:

  - Support of screen readers or keyboard navigation.

5. Custom Optical Mark Recognition model

  - The application will not use a custom-trained OMR model to scan and evaluate bubble-sheet exams.

### Measurable project objectives and related success criteria (scope of project)

Project requirements to be completed before July 5th, 2024.

1. The system will have a secure authentication system to authenticate users. To meet the best security standards for handling users’ personal information and login credentials, our system will implement the OAuth authentication protocol as one of the options for authenticating users to the system in addition to a traditional password-based authentication method with password encryption. The success of this goal can be measured by using automated testing frameworks to ensure that API doesn’t expose sensitive information about user accounts.

2. The system will support efficient exam creation and management through a user-friendly and intuitive interface as well as common bubble-sheet exam templates. On average, it will take less than 10 minutes to set up and create an exam. The user interface will be minimal and include helpful tooltips about each input field.

3. All students will be able to view their returned bubble sheets on the web application with a picture of their scanned exam to verify grading accuracy. 

4. Instructors must be able to see detailed analytics and have access to reporting tools, including year-over-year performance comparisons and at least five types of report visualizations with the option to export the data. This will be achieved by using front-end libraries for data visualization and affording professors glanceable performance assessments.

5. The administration system dashboard will include tools allowing administrators to manage users’ accounts, courses, and semesters. The success of this goal can be measured by the ability of administrators to perform routine tasks in the system with minimal training. To achieve the goal, the system will have a minimal user interface, tooltips, a description of the tools, and a minimal amount of steps to accomplish the task.


## Users, Usage Scenarios and High-Level Requirements

### Users Groups:

1. Instructor Use Cases:

  - Create and manage classes and exams.
  - Upload scanned bubble sheets.
  - Parse and mark bubble sheets.
  - Review exam results and run analytics.
  - Visualize student performance and benchmarks.
  - Download exam results.

3. Student Use Cases:

  - Log in to view exam results.
  - Review detailed performance on exams via the dashboard.
  - Access exam results within the designated time frame.

4. Administrator Use Cases:

  - Manage user accounts and roles.
  - Create semesters/terms to manage and archive course data and limit access to the course material.

### Proto-Personas:

#### Instructor Jane

Behaviors:

  - Curious about a broad range of topics
  - Regularly uses PowerPoint and Google Slides to deliver their lectures
  - Frequently uses Teams/Zoom to communicate with students

Demographics:

  - 45 years old
  - Male
  - PhD
  - Economics Major

Needs/Goals:

  - Wants to easily create bubble sheets to be used for exams
  - Wants to easily grade a large stack of scanned bubble sheets
  - See analytics from automatically graded exams
  - Compare and visualize student performance between different years

#### Student Alex

Behaviors:

  - Regularly checks the online portal for grades and feedback.
  - Reviews test results to identify strengths and areas for improvement.
  - Frequently reaches out to professors and academic advisors for support.

Demographics:

  - 20 years old
  - Undergraduate student
  - Major in Biology
  - Full-time student

Needs/Goals:

  - Easily able to log in and view their recent exam.
  - Have metrics to see how their performance compares to others.
  - Wants to verify that the system graded their exam correctly.
  - Prefers to access exam results and performance dashboards on both mobile and desktop devices.

#### Admin Sarah

Behaviors:

  - Keeps a clean and organized workspace, both physically and digitally, to enhance productivity and reduce clutter.
  - Communicates frequently with other staff to solve administrative-related tasks
  - Provides on-demand support when additional permission/authorization is required

Demographics:

  - 35 years old
  - Female
  - Master’s degree in Information Technology
  - IT Administrator at a university

Needs/Goals:

  - Efficiently manage user accounts and roles within the system.
  - Ensures the system runs smoothly and performs optimally with minimal downtime.

### Envisioned Usage

#### Instructor:

Scenario #1:

1. Signs into the system
2. Creates a new course by selecting or inputting the course name and semester.
3. Creates an invite link for students to join the course

Scenario #2:

1. Creates an exam by setting the name and date of the exam
2. Creates a bubble sheet version of an exam with the number of questions, number of answers per question, amount of points per question, and correct answers with a front-end UI
3. Sets correct answers for the exam
4. Submits the desired design and shortly thereafter receives download links for two PDFs: one with the answers and one with the blank sheets for printing and distribution. 

Scenario #3:

1. Uploads the PDF version of scanned bubble sheets to a selected exam
2. Submits the sheets to the system so it can parse and grade each submission
3. Reviews the parsed sheets and makes any adjustments where the system incorrectly graded the exam
4. Releases grades to the students for review

Scenario #4:

1. Navigates to the exam page within their course
2. Selects an option to view the statistics of an exam with an option to compare with historical data
3. Downloads the CSV version of the report

#### Student:

Scenario #1:

1. Signs into the system
2. Uses the invite link or code to join the course
3. Sees the course on a central dashboard and selects it to see scheduled or graded exams
4. Clicks on a graded exam
5. Reviews the assigned grade 
6. Evaluates their performance by comparing their grade with the average and quartiles of the exam.

#### System Administrator:

*Scenario #1:*

1. Administrator signs in to the system
2. Administrator navigates to the list of students
3. Clicks on a student to bring up a list of actions:

  - Change the user’s role from a student to an instructor account
  - Delete student account
  - Modify student account details
  - View all courses that the student is in

5. Removes student from a course


*Scenario #2:*

1. Administrator signs in to the system
2. Administrator navigates to the list of instructors
3. Clicks on an instructor to bring up a list of actions:

  - Change the user’s role from an instructor to a student
  - Delete instructor account
  - View all courses that the instructor is teaching
  - Modify instructor account details

*Scenario #3:*

1. Administrator signs in to the system
2. Navigates to the administrator dashboard
3. Clicks on “Manage semesters” to see a list of actions:

  - Add a new semester to the system with the start and end date
  - Modify semester
  - Delete semester


#### *Journey Lines*

##### Instructors:

1. Login -> Create course -> Course Dashboard -> Create an invite link for the course.

2. Login -> Access Course Dashboard -> Create Exam -> Download PDF file with bubble-sheet exams and an answer.

3. Login -> Access Course Dashboard -> Access Exam -> Upload Exam PDF File -> Review parsed and graded exams -> Release Grades. 

4. Login -> Access Course Dashboard -> Access Exam -> Navigate to Analytics -> Review exam performance -> Measure with historical data -> Download CSV version of the report.


##### Students:

1. Login -> Access course -> Select an exam -> View Exam Results-> Evaluates performance


##### System Administrators:

1. Login -> System Management Portal -> Users Dashboard -> Update roles of the user

2. Login -> System Management Portal -> Semester Dashboard -> Manage terms


### Requirements:

#### Functional Requirements:

The system will:

  - Allow the user to upload the bubble-sheet PDF file and answer key for the exam.
  - Allow users to create a custom bubble-sheet exam, allowing to specify the number of questions, answers per question, and points allocated to each question.
  - Let specific groups of users toggle the visibility of grades for the exam.
  - Allow manual grade modification after automatic parsing and calculation by the system.
  - Provide access to numerical data related to the exam, including class average over time, score distribution, mean, median, standard deviation, percentiles, and performance by question.
  - Allow users to create multiple courses in the system, including options to choose a course code, set the name, and select the term session.
  - Allow users to generate an invitation link for students to join the course.
  - Provide feedback to users on their exams, indicating correct and incorrect answers with red and green bubbles respectively.
  - Provide users with the ability to view their scores in relation to the class average and quartile placement.
  - Allow users to join a course using the invitation link provided by the instructor.
  - Implement account creation options, including signing in with Google or using an email and password combination.
  - Allow roles of user accounts to be changed.
  - Enable the creation, modification, and deletion of term sessions.
  - Recognize and account for incorrect scaling and orientation of the exam.

#### Non-functional Requirements:

  - The application will handle unexpected errors and return meaningful messages to the user.
  - The code will follow the standards outlined by the programming languages used in the project.
  - Sensitive information (i.e., database credentials and API tokens) will not be accessible to the public.
  - The application will use a role-based access system to limit the user's access to protected functionality or features. 
  - The system will use a microservices approach architecture to ensure the application's scalability by allowing independent deployment, maintenance, and scaling of individual services. 
  - Will handle multiple concurrent requests without noticeable blocking
  - Will use a component-based architecture to prevent code repetition and improve maintainability
  - Will have documentation for every component.
  - The application will be able to support both desktop and mobile devices for the best user experience.


#### User Requirements:

##### Instructor Requirements:

1. Instructors will be able to upload a bubble-sheet PDF file and answer key for the exam.
2. Instructors will be able to create a custom bubble-sheet exam that is able to specify the:

  - number of questions
  - answers per question
  - points allocated to each question.

3. Instructors will be able to toggle the visibility of grades for the exam.
4. Instructors will be able to manually modify grades after automatic parsing and calculation by the system.
5. Instructors will be able to access numerical data related to the exam, including:

  - class average over time
  - score distribution, mean, median, standard deviation, and percentiles
  - performance by question.

6. Instructors will be able to create multiple courses in the system, including options for

  - choosing a course code
  - setting the name of a course
  - selecting the term session.

7. Instructors will be able to generate an invitation link for students to join the course.


##### Student Requirements:

1. Students will be able to create accounts by

  - Using Google authentication
  - Using an email and password combination.

2. Students will be able to join a course through an invite link provided by an instructor.

3. Students will be able to view their exams while the courses are active.

4. Students will receive feedback on their performance by 

  - Having errors highlighted in red.
  - Being able to compare their individual performance with that of the overall class performance through metrics:
    - Average
    - Median
    - Quartiles



##### Administrator Requirements:

1. Administrators will be able to view a list of all users. From this list, they can:

  - Add user
  - Remove User
  - Modify User information, including role


2. Administrators will be able to view a list of courses. From this list, they can:

  - Add courses
  - Remove Courses
  - Modify Courses, including roles within the courses and enrollment
  - Within a course, they can view an exam events list where they can:
    - Add exams
    - Remove exams
    - Modify exam names, dates, and submission information


3. Administrators will be able to view a list of yearly sessions and terms(e.g. Summer 2024 T1). From the list, they can:

  - Add sessions and terms
  - Remove sessions and terms
  - Modify the school term's start and end date


#### Technical Requirements:

1. Microservices Architecture

  - Each project component will be its own service running independently, and communication between components will be done with an open API endpoint. Microservices will communicate with each other via Apache or Nginx proxies and ExpressJs middleware for database communication.


2. Security

  - Passwords and sensitive information will be encrypted using a hashing-based approach available in libraries such bcryptjs and JWT tokens to share information between microservices.
  - As an alternative to a password-based authentication system, the application will also use an external authentication provider (Google OAuth) to sign in users within the system, which shares limited information about users.


3. Optical Mark Recognition (OMR) system

  - An open-source pre-trained OMR model will be used to grade bubble-sheet exams automatically. No GPU availability will be assumed.
  - Pre  - and post-processing, including reading and generation of PDFs, will be performed using Python libraries.
  - The output of the OMR system will be in JSON format.


4. Database

  - A relational database (PostgreSQL) will be used to store user information and processed bubble sheet data.
  - The data will be entered through forms on the NextJS frontend, passed as JSON data to the ExpressJS backend, and then pre-processed in ExpressJS before being stored in PostgreSQL.

5. Continuous Integration / Continuous Deployment

  - In addition to local testing, GitHub Actions will be used to test, build, and deploy the services to the production server.


6. Testing

  - The project will use automated unit testing, integration, and end-to-end testing frameworks such as Jest (Javascript), unittest (Python), and Cypress (Nextjs).
  - Each member of the team will be performing manual user acceptance and security testing on code changes that were made in pull requests.


7. Containerization 

  - Docker will be used to containerize the application, with scripts for setting up the project on any machine and a PostgreSQL database running within the container for querying and testing.


8. Documentation

  - Components and functions will be documented with JSDoc (Next.js) and Docstrings (Python).
  - To help keep track of development progress, pull requests will be detailed and include changes, fixes, and feature additions.
  - Each microservice will include a README detailing setup, uses, and functionality.


## Tech Stack

### User Devices

Desktop Layout

  - The primary interface for all functionalities.


Mobile Layout

  - Specifically for viewing grades on smartphones and tablets.


### Frontend

Next.js

  - A popular React framework for server-side rendering and static site generation, it is currently widely adopted in the industry and one of the highly recommended frameworks listed by React documentation. It offers robust performance benefits and development speeds with the App router.


Tailwind CSS with Flowbite

  - Utility-first CSS framework (Tailwind) and a UI component library (Flowbite) for quickly building responsive and modern user interfaces. Interacts well with Next.js. Tailwind is highly used in the industry as each component can have glanceable CSS styling.


### Backend

ExpressJS Backend Middleware

  - A Node.js web application framework that manages connections between the database, front-end, and other Python backends. Express.js is a widely used framework for building web applications and APIs with Node.js. The reason for creating this middleware is to ensure that the application is scalable and easy to add on to.

Python Processing Backend

  - Python was selected for its robust selection of libraries:

    - For OMR, we will likely use the OMRChecker PyPi library. 
    - For PDF manipulation, we will use the ReportLab library.


### Database

PostgreSQL

  - A powerful, open-source relational database system known for its reliability and performance. Unlike MySQL, it can also store JSON payloads, making it useful for saving bubble sheet formats to the servers without storing PDF files.


### Containerization

Docker

  - Used for containerization to ensure consistency across different development and production environments. Reduces the risk of “it works on my machine” problems and makes it easier for maintainers to get the system up and running.


### Version Control and Code Quality

Git and GitHub

  - Git is used for a distributed version control system to track changes in source code. GitHub is the platform we use to manage that code, track issues, and handle pull requests. These are essential tools used widely and already required in this class.


Husky

  - Utilized pre-commit hooks to ensure code quality by running linters and tests before committing code changes.


#### Linting and Formatting

Both Prettier and Black are highly opinionated to match common practices (and in the case of Black, ensure meeting PEP8 standards)

EsLint with Prettier

  - For maintaining code quality and style in JavaScript.

Black

  - For Python code formatting to ensure consistency and readability.


### Testing

Jest and Cypress 

  - A JavaScript testing framework for testing Next.js and Express.js applications.


Pyunit (unittest)

  - The built-in Python testing framework


### Dependency Management

npm (Node Package Manager)

  - A package manager for JavaScript, essential for managing dependencies and packages for the Node.js environment. It provides access to a vast repository of open-source packages and tools, making development faster and easier.

Poetry

  - A dependency manager for Python that handles package installations and virtual environments. Updates as packages are added and locks required versions, treating every Python directory it is in as a submodule for better project integration.

### Continuous Integration and Deployment

Semantic Release action (GitHub Actions) 

  - Automates the versioning and package publishing process using semantic versioning so that releases are predictable and consistent.

Possible Structure:

# ADD IMAGE HERE

## High-level risks

  - Time frame: The short time available (12 weeks) to complete the project may affect the final deliverables.
  - New technologies: The learning curve associated with unfamiliar technologies may affect the project's progress.
  - OMR Model availability: Since we will not be developing our own OMR model, marking accuracy will depend on the performance of pre-trained open-source OMR models.
  - Limited computation resources: In addition, since the availability of a GPU cannot be assumed, state-of-the-art models might not be considered in the interest of system performance.
  - PDF file size: Large PDF files may impact the performance and storage needs of the server where the application will be hosted.
  - User error: Since the performance of OMR models is highly dependent on the quality of the input (lighting, orientation, contrast, skew, scale, etc.), the quality of the scans provided by the users may affect system performance. 


## Assumptions and constraints

What assumptions is the project team making and what are the constraints for the project?

### Assumptions:

  - Input format:
    - Uploaded exams will be assumed to be in standard PDF format.
    - PDFs will be assumed to be in black and white.
    - It is assumed that each exam submission will be, at most, a single double-sided page.
  - Bubble sheet format: It is assumed that uploaded bubble sheets will satisfy the following criteria:
  - In addition to handwritten student names and/or IDs, the answer sheets will allow students to provide their names and/or IDs using bubbles.
  - OMR Model availability: A viable open-source OMR model is assumed to exist.
  - GPU availability: A GPU is not assumed to be available for use in development and the deployed system.


### Constraints:

  - Development time: A short 12-week time frame will be used for the development of the project. The development will cease after August 9, 2024.
  - PDF size: The PDF file size shouldn’t exceed 100 MB to avoid degradation in the workers’ performance and backing up jobs to process for other courses.


## Summary milestone schedule

Identify the major milestones in your solution and align them to the course timeline. In particular, what will you have ready to present and/or submit for the following deadlines? List the anticipated features you will have for each milestone, and we will help you scope things out in advance and along the way. Use the table below and just fill in the appropriate text to describe what you expect to submit for each deliverable. Use the placeholder text in there to guide you on the expected length of the deliverable descriptions. You may also use bullet points to clearly identify the features associated with each milestone (which means your table will be lengthier, but that’s okay). The dates are correct for the milestones.

|   |   |
|---|---|
|Milestone|Deliverable|
|May 29th|Project Plan Submission|
|May 29th|A short video presentation describing the user groups and requirements for the project. This will be reviewed by your client and the team will receive feedback.|
|June 5th|Design Submission: Same type of description here. Aim to have a design of the project and the system architecture planned out. Use cases need to be fully developed. The general user interface design needs to be implemented by this point (mock-ups). This includes having a consistent layout, colour scheme, text fonts, etc., and showing how the user will interact with the system should be demonstrated.|
|June 5th|A short video presentation describing the design for the project. This will be reviewed by your client and the team will receive feedback.|
|June 14th|Mini-Presentations (Milestone 1):<br><br>1. Authentication system: users can create and sign in to their accounts using the Google OAuth authentication protocol.<br><br>2. Dockerized environment: Back-end, front-end, and database components of the system will be running in a Docker container<br><br>3. CI / CD: The GitHub Actions CI/CD pipeline will be set up to run tests and build jobs for each service.<br><br>4. Course management: users will be able to create and join a course.|
|July 5th|MVP Mini-Presentations (Milestone 2): <br><br>1. Authentication system: users can create and sign in to their accounts using the email and password authentication method.<br><br>2. Course Management System: <br><br><br>1. Professors will be able to create exams and release grades for students.<br><br>2. Professors can upload the UBC standardized exam bubble sheet and receive a processed and graded exam.<br><br>3. Professors can build custom versions of bubble-sheet exams and download them for distribution.|
|July 18th|Milestone 3:<br><br>1. Course Management System:<br><br><br>1. Students will able to view their grades and graded bubble-sheet exams<br><br>2. Professors will be able to view the analytics of exams<br><br><br>3. System administration:<br><br><br>1. Administrators will be able to edit users’ roles<br><br>2. Administrators will be able to create and modify semesters|
|July 19th|Peer testing and feedback: Aim to have two additional features implemented and tested per team member. As the software gets bigger, you will need to be more careful about planning your time for code reviews, integration, and regression testing.|
|August 2nd|Test-O-Rama: Full-scale system and user testing with everyone|
|August 9th|Final project submission and group presentations: Details to follow|

  

## Teamwork Planning and Anticipated Hurdles

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|Category|Bennett|Dima|Francisco|Ishika|Paula|
|Experience|Previously worked as a back-end developer for a big data company. Worked with java springboot and implemented API endpoints and a user authentication system.  <br>  <br>Worked on CI/CD pipelines in Jenkins and wrote Dockerfiles to setup testing environment|Experienced in developing and maintaining high-performance pipelines that can collect, store, and analyze large amounts of data. <br><br>  <br><br>Developed CI and CD pipelines to automate testing and deployment processes.|HCI researcher for two years first working on in-situ user interfaces for mixed reality applications and now working in social robotics with a focus on safe AI and affective computing (much of the work done with python and next.js for studies)<br><br>  <br><br>Previously worked as a SQL developer, front-end developer, and data scientist at other organizations.|I worked as a developer co-pilot in UBC Vancouver for 4 months where I was exposed to different technologies.I did contribute to a healthcare website that was built in React and Typescript.<br><br>I also did participate in two hackathons last year, where I gained experience in UX/UI Design and Front-end development.|I have experience modifying a website built in Django.  As a framework, I feel that it shares some similarities in ideas with Next.js which I am familiarizing myself with.  My experience working on deep learning methods for optical character recognition does also give me some good background for this project.|
|Good At|NextJS, Docker, Python, SQL, PHP|Ruby, AWS, Python, NextJS, PHP, DevOps, and Docker.|Relevant to this project scope:<br><br>nextJS, docker, python, <br><br>PHP,<br><br>SQL|HTML, CSS, JavaScript,React Frameworks,<br><br>Python<br><br>Familiar with docker, SQL, PHP<br><br>Figma|Python<br><br>Communication<br><br>Planning<br><br>Research<br><br>Presentation<br><br>Documentation<br><br>  <br><br>Familiar with Docker, AWS, SQL|
|Expect to learn|Express.js  <br>Tailwind<br><br>  <br><br>I expect to become more familiar with UI design and front-end since most of my experience has been working on back-end related programming. This is also the first large project that I have a say in the design so I expect to learn about the pitfalls of designing a large programming project.|Front-end development.<br><br>  <br><br>I spent most of my time as an intern and software developer creating applications behind the “curtain.” While I have background knowledge of React-based applications, I would like to learn more about state and memory management within the front end.|Better application of devops and programming in a team, my last two years working have been as a researcher working on my own codebases.<br><br>  <br><br>Better application of industry development practices across the full stack.|Developing a full-fledged application based on industry standards from scratch in a collaborative manner.<br><br>  <br><br>Apart from enhancing my existing front-end skills, I want to contribute in backend dev of the project where I have the least experience in.|Technologies:<br><br>Next.js<br><br>PostgreSQL<br><br>Express.js<br><br>Bull<br><br>  <br><br>Concepts:<br><br>As someone with more of a math background, the whole concept of developing an application from scratch using industry standards has been more of a theoretical concept to me. This project will be a great learning experience for me, and I am fortunate to have knowledgeable teammates!|


|   |   |   |   |   |   |
|---|---|---|---|---|---|
|Category of Work/Features|Bennett|Dima|Francisco|Ishika|Paula|
|Project Management: Kanban Board Maintenance|✔️|✔️|✔️|✔️|✔️|
|System Architecture Design||✔️|✔️||✔️|
|User Interface Design||✔️||✔️|✔️|
|CSS Development|✔️||✔️|✔️||
|Authentication System|✔️|✔️||||
|Course Management System (Creating courses and exams)|✔️|✔️||||
|Instructor Visualization dashboard|||✔️|✔️|✔️|
|Student Visualization dashboard|||✔️|✔️||
|OMR Grading|✔️||✔️||✔️|
|PDF Answer highlighting for students|||✔️||✔️|
|Bubble Sheet Generator (Backend)|✔️||✔️|✔️|✔️|
|Bubble Sheet Generator (Frontend)|✔️|✔️||||
|Database setup||✔️|✔️|||
|CI / CD pipeline setup||✔️||||
|Test automation setup|✔️|✔️|✔️|✔️|✔️|
|Presentation Preparation|✔️|✔️|✔️|✔️|✔️|
|Design Video Creation|✔️|✔️|✔️|✔️|✔️|
|Design Video Editing|✔️|||||
|Design Report|✔️|✔️|✔️|✔️|✔️|
|Final Video Creation|✔️|✔️|✔️|✔️|✔️|
|Final Video Editing|✔️|||||
|Final Team Report|✔️|✔️|✔️|✔️|✔️|
|Final Individual Report|✔️|✔️|✔️|✔️|✔️|


Tasks assignment justifications:

Everyone on the team is assigned to the class work, as we are all expected to contribute to and understand the project components. Project work distribution has been decided based on each member’s skills and strengths and other members' willingness to learn new concepts/technologies. In addition, several of the features have more members working on them than actually required, as everyone is excited to learn more in this course.