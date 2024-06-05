# System Design

## Introduction

This document details the design proposal for an optical marking management web application which aims to provide educators with a robust, efficient, and accurate tool for digitally creating, administering, and automatically parsing and grading scanned bubble-sheet exams. 

  

Start with a brief introduction of what you are building, reminding the reader of the high-level usage scenarios (project purpose). Complete each section with the required components. Don't forget that you can include [images in your markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images).

Start each section with a lead-in, detailing what it is. Also, do not just have a collection of images. Each diagram must be explained clearly. Do not assume that the reader understands the intentions of your designs.

## System Architecture Design

We chose to design a microservices architecture to have each distinct part of the system exist within its own container. This allows us to scale our application if needed, queue data processing, and work on features without bringing down the rest of the system, allowing us to test out different libraries and frameworks in parallel. The components are all separate except for a connection to a Nest.js backend, which all the other modules connect to via stubs. This prevents any module from accessing the DB directly and from affecting the functionality of the others.

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXf95dhSPIBvarlhg4u-Mzt4robUIyDwjuN5pDMBk-DkAmI2AfOcSRLzLSfIE69ilrjwlFRu3NTBIkgmot6qMhcbZip87ML55JagsAjULTw3xb0ggLGTjkOG3t4QFyk6GClsCH5lHbuqr2anqAHtRotfabDD?key=JLhAxdZn9C4A1hqwb0WwYA)

## Use Case Models

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXfIp2h2yztS56BEdgl_uFSt1NPgXvK5d5jIKV0gFzYVEZZ67PfevQIuJ3z69IDBKORwSc4gQ1WbR0qS-rph-goUk_GeJKXa9dP2YLJaV6fTyJXi6szP6yrMXLoVuQjk6RAZgd3dyCeyLYH5YRljrRSx4ikE?key=JLhAxdZn9C4A1hqwb0WwYA)

#### Use Case 1: Delete a semester

Primary actor: Administrator

Description: Describes the process of deleting a semester.

Precondition: The user must have an administrator role and be logged into the system.

Postcondition: The designated semester is deleted.


##### Main Scenario:

1. The administrator locates the semester to delete

2. By finding the semester manually
    
3. By searching the semester with the search bar
    
4. The administrator clicks the edit button for the semester, which redirects him to the Semester settings page
    
5. The Administrator clicks the “Delete this semester” button
    
6. The semester is deleted from the database
    

##### Extensions:

1. Error connecting to the database:
    
2. The system notifies the user there is an error connecting to the database
    
3. Error deleting the semester
    
4. The system notifies the user there is an error deleting the semester
    
  

#### Use Case 2: Create a Semester

Primary actor: Administrator

Description: Describes the process of creating a new semester.

Precondition: The user must have an administrator role and be logged into the system.

Postcondition: A new semester is created and saved in the database.

##### Main Scenario:

1. Administrator clicks on the “Add semester” button
    
2. Administrator enters the semester details (e.g., name, start date, and end date)
    
3. Administrator submits the form
    
4. The system validates the input data
    
5. If the data is valid, the new semester is created
    
6. Semester is saved to the database
    
7. The system notifies the administrator about the creation of the semester
    

##### Extensions:

1. Invalid data is entered 

2. System notifies the user that invalid data was entered and repopulates the form with the data that the user previously tried to enter  

3. Error connecting to the database:   

4. System notifies the user there is an error connecting to the database   

5. Error creating the semester

6. System notifies the user there is an error creating the semester
    


#### Use Case 3: Modify course details

Primary actor: Administrator  
Description: Describes the process of making changes to the course details.

Precondition: The user must have an administrator role and be logged into the system. There must be a course that can be modified.

Postcondition: The class details are modified

##### Main Scenario:

1. Administrator navigates to the classes page
    
2. Administrator selects the class that needs to be modified

3. By manually searching for the course
    
4. By searching the course with the search bar
    
5. Administrator clicks on the “edit” course button
    
6. Administrator is navigated to the Edit Course page
    
7. Administrator makes changes to the course (i.e., name, course invite code, semester)
    
8. Administrator confirms the changes by clicking “Save changes”
    
9. The database is updated
    
10. The system notifies the administrator that the course details were changed
    

##### Extensions:

1. Error connecting to the database:
    
2. System notifies the user there is an error connecting to the database

3. Error modify the course details:   

4. System notifies the user there is an error updating course details
    
5. System notifies the user there one or more input fields are invalid
    
  

#### Use Case 4: Manage user permissions

Sub case 4a.

Primary actor: Administrator

Description: Describes the process of changing the user’s role from a student to an instructor.

Precondition: The user must have an administrator role and be logged into the system. At least one student account must exist.

Postcondition: The selected student account is changed into an instructor account.

  

##### Main Scenario:

1. Administrator navigates to the “Users” page.
    
2. Administrator selects the student account which needs to be changed.
    
3. By manually searching for the user
    
4. By searching the user with the search bar
    
5. Administrator changes the role of the account to “instructor” using the dropdown menu.
    
6. The database is updated.
    
7. System confirms that the change has been successfully applied.  
      
    

##### Extensions:

1. Error connecting to the database:
    - System notifies the user there is an error connecting to the database
    

2. Error updating the user role:
    - System notifies the user there is an error updating the user role.
    

Sub case 4b.

Primary actor: Administrator

Description: Describes the process of changing the user’s role from an instructor to a student.

Precondition: The user must have an administrator role and be logged into the system. At least one student account must exist. At least one instructor account must exist.

Postcondition: The selected instructor account is changed into a student account.

  

##### Main Scenario:

1. Administrator navigates to the “Users” page.
    
2. Administrator selects the instructor account which needs to be changed.
    
3. By manually searching for the user
    
4. By searching the user with the search bar
    
5. Administrator changes the role of the account to “student” using the dropdown menu.
    
6. The database is updated.
    
7. System confirms that the change has been successfully applied.   
    

##### Extensions:

1. Error connecting to the database:
    

1. System notifies the user there is an error connecting to the database
    

3. Error updating the user role:
    

1. System notifies the user there is an error updating the user role.
    

#### Use Case 5: View Submitted Exams

Use case 5a.

Primary actor: Instructor

Description: Describes the process of the instructor viewing a student’s submitted exam.

Precondition: The instructor must be logged in. There is at least one student who has a submitted exam.

Postcondition: The instructor is able to view a student’s exam. 

  

##### Main Scenario:

1. The instructor selects a course from their dashboard.
    
2. The instructor selects an exam.
    
3. The instructor selects a student.
    

1. By manually searching for the user
    
2. By searching the user with the search bar
    

4. The instructor views the student’s exam.
    

  

##### Extensions:

1. Error retrieving the exam details/generating the graded PDF file.
    

1. System notifies the user of the error retrieving the exam details.
    

Use case 5b.

Primary actor: Student

Description: Describes the process of the student viewing their graded exam.

Precondition: The student must be logged in. The student has at least one graded exam.

Postcondition: The student is able to view their graded exam.

  

##### Main Scenario:

1. The student selects a course from their dashboard.
    
2. The student selects a graded exam.
    
3. The student clicks on the “view” button associated with the exam.
    
4. The student is able to view the graded exam along with the associated metrics.
    

  

##### Extensions:

1. Error retrieving the exam details/generating the graded PDF file.
    

1. System notifies the user of the error retrieving the exam details.
    

  

#### Use Case 6: Join Course

Primary actor: Student

Description: Describes the process to join a course using the invite code.

Precondition: The instructor must be able to generate an invite link. There must be a course that exists for students to join.

Postcondition: The student is able to view the course.

##### Main Scenario:

1. The student signs into the system. The student gets access to a dashboard.
    
2. The student gets an invite link from the instructor.
    
3. The student pastes the invite link in their browser window and gets redirected to the validation page
    
4. The system validates if the student is signed in and the invite link contains a valid course invite code
    
5. The system updates database record to add student to the course
    
6. The student is redirected to the course dashboard page
    

##### Extensions:

1. Error accessing the course 
    

1. The system notifies the student that access to the course is denied.       
    

2. Error validating the invite course link
    

1. The system notifies the student that the invite code in the link is invalid
    

  

#### Use Case 7: Create Exam with Custom Bubble sheet

Primary actor: Instructor

Description: Describes the process to create an exam.

Precondition: The instructor must have access to the course. 

Postcondition: The instructor is able to create an exam with custom bubble sheet.

##### Main Scenario:

1. The instructor clicks on a course. Clicks on the button “Create exam”
    
2. The instructor inputs the exam name and selects the exam date
    
3. The instructor clicks on “Create Custom Sheet” and gets redirected to the page where they can create a custom bubble sheet exam
    
4. The instructor sets the number of questions, points worth per question, possible number of options, and exam instructions
    
5. The instructor previews the custom bubble-sheet exam
    
6. The instructor confirms that the exam visually looks correct and clicks the “Save” button, which redirects him back to the Exam creation page with their previously inserted exam name and selected exam date
    
7. The instructor clicks the “Publish” button
    
8. The system adds a new exam to the database
    
9. The system notifies an instructor that the exam has been published
    
10. The instructor gets redirected to the course page
    

##### Extensions:

1. Error connecting to the database:
    

1. System notifies the user there is an error connecting to the database
    

2. Error creating an exam:
    

1. System notifies the user that one or more input fields were invalid either on the “Create Exam” or “Create Bubble-sheet” page
    
2. System notifies the user that there was an error generating a bubble-sheet exam
    

  

#### Use Case 8: Delete a course 

Primary actor: Instructor

Description: Describes the process of deleting a course. 

Precondition: The instructor must be enrolled in the course. The course must exist.

Postcondition: The instructor deletes the course

##### Main Scenario:

1. The instructor signs in to the system
    
2. The instructor clicks the Courses tab on the dashboard. 
    
3. The instructor clicks the View Course button to go to a particular course. 
    
4. The instructor clicks the “Course Settings” and gets redirected to the course settings page
    
5. The instructor clicks the “Archive this Course” button
    
6. The system notifies the instructor that the course has been archived
    
7. The course is archived
    
8. The instructor gets redirected to the main dashboard
    

##### Extensions:

1. Error connecting to the database:
    

1. The system notifies the user there is an error connecting to the database
    

2. Error deleting the semester:
    

1. The system notifies the user there is an error deleting the course
    

  

#### Use Case 9: Create a Course

Primary actor: Instructor

Description: Describes the process of how the instructor can create a course in the system.

Precondition: The user must have an “instructor” role assigned to them.

Postcondition: The instructor creates a new course in the system.

##### Main Scenario:

1. The instructor signs into the system
    
2. The instructor clicks the “Create course” button on the main dashboard page  
    
3. The instructor enters the course code, name, and section and selects one of the available semesters created by the administrator
    
4. The course is created, and the instructor receives the “Instructor” role in the created course
    

##### Extensions:

1. Error connecting to the database:
    

1. The system notifies the user there is an error connecting to the database
    

      2.   Error creating the course

1. The system notifies the user if the course code, name, or section inputs are empty or too long
    
2. The system notifies the user if the term is not selected
    
3. The system notifies the user if the selected term cannot be used to create a course
    
4. The system notifies the user if there is an error creating the course
    

  

#### Use Case 10: Remove Student from the Course

Primary actor: Instructor

Description: Describes the process of how the instructor can remove the student from the course.

Precondition: Both instructor and student must be enrolled in the existing course. 

Postcondition: The instructor removes the student from the course.

##### Main Scenario:

1. The instructor signs into the system
    
2. The instructor navigates to the “Course” page and then to the “People” page
    
3. The instructor looks for the student they want to remove from the course
    

1. The instructor uses the search bar to find the student they want to remove from the course
    
2. The instructor scrolls through the list of students to find the student they want to remove from the system
    

4. The instructor clicks on the button “Remove student”
    

5. The student is removed from the course
    

##### Extensions:

1. Error connecting to the database:
    

1. The system notifies the user there is an error connecting to the database
    

      2.   Error removing the student from the course

1. The system notifies the instructor if the selected user cannot be removed from the course
    

#### Use Case 11: Delete Exam from the Course

Primary actor: Instructor

Description: Describes the process of how the instructor can delete an exam from the course

Precondition: The exam must have been created in the same course where the user has an “Instructor” role. 

Postcondition: The Instructor removes the exam from the course.

##### Main Scenario:

1. The instructor signs into the system
    
2. The instructor navigates to the “Course” page and clicks on the “Edit” button for the selected exam
    
3. The instructor clicks on the “Delete Exam” button
    
4. The exam is removed from the course. All of the relevant files and records in the database are deleted
    

##### Extensions:

1. Error connecting to the database:
    

2. The system notifies the user there is an error connecting to the database
    

      2.   Error removing the exam from the course

2. The system notifies the instructor if the exam cannot be removed from the system 
    

  

#### Use Case 12: Grade Exams

Primary actor: Instructor

Description: Describes the process of how the instructor can upload an exam for grading

Precondition: The instructor must be enrolled in the course. The exam must have been created previously. The instructor has created a bubble sheet or is using an existing bubble sheet.

Postcondition: The system has processed the exam, and grades are published for the exam.

##### Main Scenario:

1. The instructor signs into the system
    
2. The instructor navigates to the “Course” page and clicks on the “Edit” button for the selected exam
    
3. The instructor clicks the button “Upload Submissions,” where they are presented with the window to select the PDF file with bubble-sheet exams
    
4. The system processes and grades uploaded PDF file and adds the list of graded students and their marks
    
5. The instructor validates all exams are marked correctly and clicks the button “Release Grades”
    

##### Extensions:

1. Error connecting to the database:
    

1. The system notifies the user there is an error connecting to the database
    

      2.   Error uploading exams

1. The system notifies the instructor if the exam file has an incorrect extension
    
2. The system notifies the instructor if the exam file is too large
    

      3.   Error processing PDF file

1. The system notifies the instructor if the exam file cannot be processed 
    
2. The system notifies the instructor if one or more submissions cannot be graded
    

  
  

#### Use Case 13: View Course Analytics

  

Primary Actor: Instructor

  

Description; Describes the process for the instructor to view the course analytics.

  

Precondition: The instructor must be enrolled in the course. The course must exist in the system.

  

Postcondition: The instructor is able to view analytics about the course.

  

##### Main Scenario:


1. The instructor signs in to the system.
    
2. The instructor navigates to the course dashboard page 
    
3. The instructor clicks the button “Analytics” and gets redirected to the page
    
4. The instructor is able to see graphs and charts related to the course average and historical average, class size, top-performing students, top challenging exams, and other charts that provide information about course performance
    

##### Extensions:

1. Error connecting to the database:
    

1. The system notifies the user there is an error connecting to the database
    

2. Error retrieving information about the course
    

1. The system notifies the user that the server was not able to return analytics about the course 
  

## Database Design

Provide an ER diagram of the entities and relationships you anticipate having in your system (this will most likely change, but you need a starting point).  In a few sentences, explain why the data is modelled this way and what is the purpose of each table/attribute.  For this part, you only need to have ONE diagram and an explanation.

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXelo3vqmKhlLpuArXnea80mqEUSIfBJ9xRrxc_P_qLjdvmOxanYq0ygrSxIyolRy6Gz7odqggEM7fQj_ITPFIL9dOq7ziANhGFOmC7h1Z96ybgeLOdT6CHk5XVFWp5wkbzy4K-azqh6DRhgR0jM5StL1NEf?key=JLhAxdZn9C4A1hqwb0WwYA)

In this diagram, we tried to decouple all information into different tables based on the use-case of features in our system. For instance:

- Student and employee IDs are on different tables since the user can be a student, employee, or both. Therefore, adding two fields in the user model doesn’t make sense, as the majority of the data will have a NULL value (As there are more students than instructors/TAs)
    
- The course users table is acting as a “course roster” since it would be inefficient to store all users in the course in the course_model table  
    
- The course model stores all information on a single course
    
- The semester name has its own table, as there can be multiple courses that are taught in the same semester
    
- The exam model stores the exam events and links to the submission model to create a relation between submissions and the exam event they belong to
    
- The submission model stores bubble sheet submissions and links to the exam they are submitting in relation to the exam model. The model also has a relation to the student_user_model to link the student ID (acquired from the submission), to the student user.
    

## Data Flow Diagram (Level 0/Level 1)

Data Flow Diagram Level 0:

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXdya_dOCmFO7ovx5O0mdV03dZI9U7oPTwQJrnnTOWw9jdYd_uqX_ROLD07rt0zncc26LVDTxgxqvoNZrpHxukYlBkvd22OKpXGnrcJug3mbFyHnjtBdWSZUlujNycibvEr45Hhf8PxJYPGPtWP4dxWcO2Ul?key=JLhAxdZn9C4A1hqwb0WwYA)


Data Flow Diagram Level 1: 

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXeGBe5VgXYmtbsUNu1w_ugEGTgtDxrLicXg57PumiSQngKE6yRZ3N_U1DdxN_k4SQncb35QI1GKXOFcA0OnZyBMm_AByONUbNarLbj0yjotA-OxmIA09qermKMyUEs5ZP5eJMROArXSJw-TKcHmbarTFtY?key=JLhAxdZn9C4A1hqwb0WwYA)


## User Interface (UI) Design

The team is required to put forward a series of UI mock-ups that will be used as starting points for the design of the system. They can be minimal but the team will need to  have at least made some choices about the interaction flow of the application.  You should consider the different major aspects of user interactions and develop UI mockups for those (think about the different features/use cases and what pages are needed; you will have a number most likely).  Additionally, create a diagram to explain the navigation flow for the MVP  prototype (and any alternate flows).  When considering your UI, think about usability, accessibility, desktop and mobile uses.  As a team, you will need to discuss design choices for the system.

  

Design Document: [https://www.figma.com/design/i5fqO3j50VS81X14C7T5Qt/Falcon-Optical-Mark-Recognition-System?node-id=0-1&t=lVGko6MxNZM4hfKI-1](https://www.figma.com/design/i5fqO3j50VS81X14C7T5Qt/Falcon-Optical-Mark-Recognition-System?node-id=0-1&t=lVGko6MxNZM4hfKI-1) 

  

Interaction flow:

  

![](https://lh7-us.googleusercontent.com/docsz/AD_4nXc7F5qE2ufnd4NYoSIIBa4Y-WdMJ8bgv8SP6vQ0zTFJ2BwBHz9D_boJxqT2IrjDd2EHGDuBpWJiCejCMQwLihhh8-lmxGPH638021Cn6vCCSXT3gOapbAi3qCtR2ZF-r8TBNFX1GKKCGMIi9I0KxdjFvpE?key=JLhAxdZn9C4A1hqwb0WwYA)