# Individual Logs

## Wednesday (6/12- 6/13)

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
