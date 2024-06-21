# Individual Logs

## Friday (6/19 - 6/20)

### Timesheet
Clockify report
![Clockify report](./images/time_report_06192024-06202024.png)

### Current Tasks (Provide sufficient detail)
  * #1: Work on implmentation of sign in and create user account with email and password
  * #2: Review backend and frontend PRs
  NOTE: The first task will most likely be completed within couple of days of the next cycle. I will expand/add to my "current tasks" new work based on the new frontend components implemented by the team.

### Progress Update (since 6/19/2024)

![GitHub Board](./images/github_06192024-06202024.png)

<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Issue #152
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)

As promised for this cycle, I fixed some bugs that we have found before the demo (both on backend and frontend) on Wednesday (I haven't created an issue for this as it took me less than an hour). I also implemented a backend point to create exams for the courses.

To conclude, since it was a very short cycle, I haven't done additional work besides my original "Cycle Goals" that I have promised. I have noticed that after implementing major components for backend API, I have started to spend less time on developing new endpoints/features as I can reuse a lot of components/interfaces from original implementation which is a good sign that our software follows DRY and KISS principles (this is primary reason why my clockify time is lower compared to the first two weeks since the project development started).

### Next Cycle Goals (What are you going to accomplish during the next cycle)
  * Implement user login, registration, password restore, and user email confirmation on backend
  * Look into what other endpoints can be implemented on backend based on the team's frontend page deliveries during the cycle. Most likely I will focus on shipping backend endpoints for exams and course pages.

## Wednesday (6/14 - 6/18)

### Timesheet
Clockify report
![Clockify report](./images/time_report_06142024-06182024.png)

### Current Tasks (Provide sufficient detail)
  * #1: Merge PR that allows professors and TAs to see students in the course (after the team reviews it)
  * #2: Review other PRs from the team
  * #3: Prepare for the demo on Wednesday
  * #4: Prepare development branch PR to be merged to master on Friday

### Progress Update (since 6/14/2024)

![GitHub Board](./images/github_06142024-06182024.png)

<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Issue #128
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Issue #142
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Issue #131
        </td>
        <!-- Status -->
        <td>Pending team review / Complete
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)

Since the last cycle, I promised to finish implementation of queue controller (Done) for python scripts. However, the work on retrieving exams information got deprioritized to accomodate new UI pages other team members are working on. As a result of this change, I focused on implementing backend endpoint to retrieve users' list for the course using a pagination approach of data retrieval to reduce the load on database. I also investigated and implemented a python script (a close to be done skeleton) for custom bubble sheet generator. The left over part for this script is to connect it to our backend and make fields customizable based on the input from backend.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
  * Implement backend endpoint to create exams in the course
  * Look into / investigate implementation of backend endpoints for creating user accounts with email and passwords (alternative to Sign in with Google). The full functionality should be implemented next Wednesday
  * Fix minor bugs with UI and backend, which were found during the team meeting on Tuesday

## Wednesday (6/12 - 6/13)

### Timesheet
Clockify report
![Clockify report](./images/time_report_06122024-06132024.png)

### Current Tasks (Provide sufficient detail)
  * #1: Queue Controller implemetion: As per our system architecture diagram, we wanted to implement a middleware that would allow our workers (python scripts) to pick up jobs to create new bubble sheets and process exams. In the current cycle, I was able to impleement this middleware, but still working on covering all test cases.
  * #2: Reviewing PRs: Reviewing pull requests from other team members to ensure that all test cases are covered by our integration and unit tests.

### Progress Update (since 6/12/2024)

![GitHub Board](./images/github_06122024-06132024.png)

<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Issue #92
        </td>
        <!-- Status -->
        <td>Complete (by the time the individual logs are merged)
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Issue #93
        </td>
        <!-- Status -->
        <td>In progress
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)

Since the last cycle, I was able to investigate and implement most of the endpoints that will be used by the queue controller system. It took me few hours to understand how the queue library (bull) works with redis and our backend framework. I expect to finish a full implementation in few hours once the new cycle starts.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
  * Finish queue controller implementation in backend
  * Implement backend endpoints related to retrieving exam results for users (upcoming, graded, and today)
  * Work on student's UI to allow them to see their exams (upcoming, graded, and today)

## Wednesday (6/7- 6/11)

### Timesheet
Clockify report
![Clockify report](./images/time_report_06072024-06112024.png)

### Current Tasks (Provide sufficient detail)
  * #1: Authentication system. I have finished backend work to sign in and create user accounts on backend, so now I just need to support Paula and Ishika to complete frontend work

### Progress Update (since 6/7/2024)

![GitHub Board](./images/github_06072024-06112024.png)

<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Issue #59
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Issue #71
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Issue #35
        </td>
        <!-- Status -->
        <td>In progress
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Issue #53
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Issue #50
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Issue #64
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Issue #75
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Issue #78
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Issue #82
        </td>
        <!-- Status -->
        <td>In progress
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)

I have completed Google OAuth on backend pretty early in the cycle. This allowed me to have extra time to add new features including:
 - Editing user details (backend)
 - Creating semesters (backend)
 - Sidebar navigation (frontend)
 - Allowing users to join the course with an invite link (backend).

So far our team is on track completing Milestone goals before the deadline. It took us some time to familiarize us team members with a tech stack on expectations of code base and design.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
  * Prepare for mini presentation on Friday
  * Review pull requests of other team members
  * Look into queue system service implementation on backend
