# Requirements checklist

## Key Delivery Points

Below is a list of requirements (key delivery points) that OwlMark satisfies.

- Users will be able to log in and create accounts using a modular system that allows multiple authentication methods.
- Users will be able to recovery passwords
- Instructors can create and manage their courses. (Dashboard of all courses they have taught/teaching)
- Students can join the course using an invite link provided by the instructor.
- Instructors will be able to create exams linked to a course.
- Instructors will be able to upload bubble sheet exams for optical recognition grading.
- Instructs will be able to use the standard UBC 100Q/200Q bubble sheets
- The system needs to handle questions where more than 1 choice is correct and/or a single question can have a combination of correct answers.
- View test statistics (five-number summary) for exam
- Students can view their scores and the digital version of the exam so that they can verify the marking correctness and mark assigned for question. If the question is marked incorrect, the incorrect and correct answer needs to be displayed.
- Students can flag questions for review with instructor (A reporting system for contesting marking errors)
- Users will only be able to view their own submissions.
- Instructors can export exam results as csv
- Administrators will be able to change the role of user accounts.
- Detection of wrongly scanned sheets and duplicate or non-present student IDs for review.
- Instructors will be able to manually update marks for a question
- Instructors will be able to release/close exam results for student viewing.
- Instructors will be able to view individual and overall performance and exam statistics.
- Instructor will be able to review a marked set of exam and be notified of questions that need to be reviewed for manual marking due to issues with OMR (see flagged questions, how the question was marked)
- View and edit the response of any particular student on multiple-choice questions for a given upload.

The following are **partially** satisfied:

- Instructors will be able to create bubble-sheet exams with a customizable number of questions and each question will have a variable number of answer choices, allowing individual points assignment for each question.
  - We allow a customizable number of questions and individual points assignment (between 0 and 1) for each question.
- Instructors will be able to assign point values to questions.

The following are not satisfied:

- Compare data across different exams/years.
- Ability to compare data with past performance of students.

## Bonus features

The following are bonus features that OwlMark satisfies:

- Administrators will be able to create semester terms for the courses.
- Bubble sheets will be properly identified and linked to a specific course/exam instance (0.5)
- The application will support an option to create and sign in with Google OAuth
- The system will allow for batch/asynchronous marking of exams (user notification of when an exam is ready to be reviewed)

- Courses and their data will be archived one year after the semester has ended (1)
- A trained ONNX model that can be improved with further training for other types of bubble sheet exam formats, trainable either on the GPU with YOLOv8 and on the CPU with ONNX (2)
- Ability to edit course information (0.5)
- Ability to edit semesters (0.5)
