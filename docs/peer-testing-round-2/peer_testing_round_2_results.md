# Peer Testing Round 2

## Tasks

We asked participants to perform the following 10 tasks. Note that tasks 2, 5, 6, 7, and 10 are repeated from the previous round of peer testing.

1. Feature 1 (student)

* Sign in to the system
* Join a course with an invite link

2. Feature 2 (student)

* Sign in to the system
* Navigate to one of your courses
* Find out what your grade is for one of the exams

3. Feature 3 (student)

* Sign in to the system
* Navigate to one of the graded exams
* View the graded submission (PDF)

4. Feature 4 (student)

* Sign in to the system
* Report a grading mistake

5. Feature 5 (instructor)

* Sign in to the system
* Create a course
* Find the newly created course in the courses table

6. Feature 6 (instructor)

* Sign in to the system
* Create an exam
* Fill out a bubble sheet with the correct answers
* Download the bubble sheets you made

7. Feature 7 (instructor)

* Sign in to the system
* Navigate to one of your exams
* Upload the submission files

8. Feature 8 (instructor)

* Sign in to the system
* Find a grade dispute ticket
* Modify the grade of the student
* Resolve the grade dispute

9. Feature 9 (instructor)

* Sign in to the system
* Select a graded exam
* Hide the grades for the exam

10. Feature 10 (admin)

* Sign in to the system
* Create a new semester
* View the changes in the semesters table

## Recorded bugs/Action items

The raw results can be found under the `/raw-results` folder. Based on the feedback, we identified a few minor usability adjustments to be made. These were recorded as [issues](https://github.com/UBCO-COSC499-Summer-2024/team-7-capstone-team-7-falcon/issues/428) in our repository. We have already addressed several of the issues. However, some of them will not be fixed due to the time constraints. 

## Analysis

The questionnaire was administered through Qualtrics, and results were downloaded as a CSV file with numeric values. The total number of completed responses received is $n=12$. We also recorded 5 incomplete responses which were not taken into account for this analysis. Since participants were prompted to answer all questions (other than the free text questions), there were no blank responses this time.

The first section of the survey focused on the tasks users were asked to perform. Questions from the [NASA Task Load Index](https://humansystems.arc.nasa.gov/groups/tlx/downloads/TLXScale.pdf), rated on a 7-point Likert scale, were utilized to evaluate four factors associated with each task: mental demand, performance, effort, and frustration. The responses for mental demand, effort, and frustration were reverse-coded for analysis and scaled to the range 0-100 (see the jupyter notebook). The following table summarises the results for each task.

|         | Mean TLX Score |
|---------|----------------|
| Task 1  | 81.8           |
| Task 2  | 83.0           |
| Task 3  | 80.7           |
| Task 4  | 86.0           |
| Task 5  | 78.8           |
| Task 6  | 82.6           |
| Task 7  | 78.0           |
| Task 8  | 76.5           |
| Task 9  | 82.2           |
| Task 10 | 83.0           |

The average raw TLX score for all tasks is $81.3$. Task 8, in particular, has the lowest TLX score, and this is reflected in the user comments which explained that it was difficult to find the buttons for changing a student's grade (this has since been fixed).

The second section made use of the standard Website Usability Scale (WUS) which is based on the System Usability Scale (SUS). Analysis was conducted according to the standard scale for SUS and the mean WUS score for our system is $71.8$. We also asked respondents to rate, on a scale of 1 to 10, how likely they were to recommend the website to others. The mean score for all participants is $7.91$.

Finally, the survey contained two free-text questions asking participants to identify elements they like about our system as well as those they would change. Overall, respondents appreciated the 'clean' and 'professinal' UI design. Areas for improvement included changing the colours/contrast of buttons to make them easier to find, and adding a loading animation for better visual feedback.

## Discussion

Overall, the results show that our improved website has high usability. In particular, our WUS score of $71.8$ is above the average score of $68$ reported in [[1]](https://measuringu.com/sus/). 

One limitation of our analysis is the low number of participants ($n=12$). It is however comparable to the sample size from the previous peer testing exercise ($n=11$). This allows us to make a fairer comparison between the results for the tasks that were repeated as shown in the following table:

|         | Round 1 Mean TLX Score | Round 2 Mean TLX Score |
|---------|------------------------|------------------------|
| Task 2  | 69.7                   | 83.0                   |
| Task 5  | 71.2                   | 78.8                   |
| Task 6  | 70.5                   | 82.6                   |
| Task 7  | 68.2                   | 78.0                   |
| Task 10 | 73.5                   | 83.0                   |

While it is important to keep in mind that the results from the first round of peer testing were skewed due to the presence of blank responses, the table still shows that the changes we made after the first peer testing exercise led to significant improvements in TLX scores for all of the repeated tasks. This is reflected in one of the survey responses which said that the participant "enjoyed the improvements from [their] last demo". In addition, our overall TLX score, WUS score, and recommendation score also showed significant improvements when compared with the results from the first round of peer testing.

Hence, we can conclude that we were successful in improving the usability of the website and that OwlMark is now a highly-intuitive product.
