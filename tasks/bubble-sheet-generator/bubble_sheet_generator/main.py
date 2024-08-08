from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from dotenv import load_dotenv
from pathlib import Path
from typing import List, Optional
import os
import requests
import time
import uuid
import logging

load_dotenv()
logging.basicConfig(
    format="%(asctime)s >> %(message)s",
    datefmt="%m-%d-%Y %I:%M:%S %p",
    level=logging.INFO,
)

FONT_BOLD = "Helvetica-Bold"
FONT_NORMAL = "Helvetica"
CANVAS_OFFSET = 200
FONT_SIZE_HEADER = 12
FONT_SIZE_SUBHEADER = 9
FONT_SIZE_TEXT = 8
FONT_SIZE_BUBBLE = 7
REQUEST_DELAY = 3  # 3 seconds
UPLOAD_PATH = (
    Path(__file__).resolve().parents[3] / "backend" / "uploads" / "bubble_sheets"
)


def draw_bubble(canvas, x, y, radius=5, fill=0):
    """Draw a bubble at the given x, y coordinates

    Args:
        canvas (reportlab.pdfgen.canvas.Canvas): Canvas object to draw on
        x (int): horizontal position of the bubble
        y (int): vertical position of the bubble
        radius (int, optional): radius of the bubble.
        fill (int, optional): 1 to fill the bubble, 0 to leave it empty
    """
    canvas.circle(x, y, radius, stroke=1, fill=fill)


def wrap_text(text, width, canvas, font, font_size):
    """Wrap text to fit within a given width

    Args:
        text (string): text to wrap
        width (int): width to wrap the text
        canvas (reportlab.pdfgen.canvas.Canvas): Canvas object to draw on
        font (string): font to use for the text
        font_size (int): font size to use for the text
    Returns:
        list: list of lines of text that fit within the given width
    """
    canvas.setFont(font, font_size)
    lines = []
    words = text.split()
    current_line = words[0]

    for word in words[1:]:
        if canvas.stringWidth(current_line + " " + word) < width:
            current_line += " " + word
        else:
            lines.append(current_line)
            current_line = word
    lines.append(current_line)
    return lines


def draw_exam_information(
    c, current_x, current_y, margin=0.5 * inch, course_name="", exam_name=""
):
    """Draw the exam information on the canvas

    Args:
        c (reportlab.pdfgen.canvas.Canvas): Canvas object to draw on
        current_x (int): horizontal position to start drawing
        current_y (int): vertical position to start drawing
        margin (int, optional): left margin of the canvas
        course_name (string): name of the course (including course code and course name)
        exam_name (string): name of the exam
    """
    c.setFont(FONT_BOLD, FONT_SIZE_HEADER)
    c.drawString(current_x, current_y + CANVAS_OFFSET, exam_name)

    c.setFont(FONT_BOLD, FONT_SIZE_SUBHEADER)
    c.drawString(current_x, current_y + CANVAS_OFFSET - 18, course_name)

    c.setFont(FONT_NORMAL, FONT_SIZE_TEXT)
    c.drawString(current_x, current_y + CANVAS_OFFSET - 50, f"Student Name: {'_' * 30}")

    c.setFont(FONT_BOLD, FONT_SIZE_TEXT)
    c.drawString(current_x, current_y + CANVAS_OFFSET - 125, "Instructions:")

    text = """
  Please follow the directions on the exam question sheet. Fill in the entire circle that corresponds to your answer for each question on the exam.
  Erase marks completely to make a change.
  """
    text_lines = wrap_text(text.strip(), 3.2 * inch, c, FONT_NORMAL, FONT_SIZE_TEXT)

    text_y = current_y + CANVAS_OFFSET - 75
    for line in text_lines:
        c.drawString(margin, text_y, line)
        text_y -= 10

    c.setFont(FONT_BOLD, FONT_SIZE_TEXT)
    c.drawString(
        current_x, current_y + CANVAS_OFFSET - 140, "Please fill in marks like this:"
    )
    draw_bubble(c, current_x + 120, current_y + CANVAS_OFFSET - 138, fill=1)


def draw_student_identification(c, current_x, current_y, width):
    """Draw the student identification section on the canvas

    Args:
        c (reportlab.pdfgen.canvas.Canvas): Canvas object to draw on
        current_x (float): horizontal position to start drawing
        current_y (float): vertical position to start drawing
        width (float): width of the canvas
    """
    c.setFont(FONT_BOLD, FONT_SIZE_HEADER)
    c.drawString(
        current_x + width / 2 - 5, current_y + CANVAS_OFFSET, "Student Identification"
    )
    c.setFont(FONT_NORMAL, FONT_SIZE_TEXT)

    for i in range(0, 10):
        if i == 0:
            c.drawString(current_x + width / 2, current_y + CANVAS_OFFSET - 20, str(i))
            draw_bubble(
                c,
                current_x + width / 2 + 2.5,
                current_y + CANVAS_OFFSET - 35,
                radius=5,
                fill=0,
            )
            c.drawString(
                current_x + width / 2 + 0.5, current_y + CANVAS_OFFSET - 37.5, str(i)
            )
            for j in range(1, 9):
                draw_bubble(
                    c,
                    current_x + width / 2 + 2.5,
                    current_y + CANVAS_OFFSET - 35 - (j - 1) * 16,
                    radius=5,
                    fill=0,
                )
                c.drawString(
                    current_x + width / 2 + 0.5,
                    current_y + CANVAS_OFFSET - 37.5 - (j - 1) * 16,
                    str(i),
                )
        else:
            c.drawString(
                current_x + width / 2 + i * 0.35 * inch,
                current_y + CANVAS_OFFSET - 20,
                str(i),
            )
            draw_bubble(
                c,
                current_x + width / 2 + i * 0.35 * inch + 2.5,
                current_y + CANVAS_OFFSET - 35,
                radius=5,
                fill=0,
            )
            c.drawString(
                current_x + width / 2 + i * 0.35 * inch,
                current_y + CANVAS_OFFSET - 37.5,
                str(i),
            )
            for j in range(2, 9):
                draw_bubble(
                    c,
                    current_x + width / 2 + i * 0.35 * inch + 2.5,
                    current_y + CANVAS_OFFSET - 35 - (j - 1) * 16,
                    radius=5,
                    fill=0,
                )
                c.drawString(
                    current_x + width / 2 + i * 0.35 * inch,
                    current_y + CANVAS_OFFSET - 37.5 - (j - 1) * 16,
                    str(i),
                )


def generate_bubble_sheet(
    filename: str,
    num_questions: int = 100,
    choices_per_question: int = 5,
    questions_per_column: int = 25,
    course_name: str = "Default course",
    exam_name: str = "Default exam",
    answers: Optional[List[List[int]]] = [],
):
    """Generate a bubble sheet PDF file

    Args:
        filename (string): name of the PDF file to generate
        num_questions (int, optional): number of questions in the exam. Defaults to 100.
        choices_per_question (int, optional): number of choices per question. Defaults to 5.
        questions_per_column (int, optional): number of questions per column. Defaults to 25.
        course_name (string, optional): name of the course. Defaults to "Default course".
        exam_name (string, optional): name of the exam. Defaults to "Default exam".
        answers (list of list of int, optional): List of lists of answers to the questions. Defaults to None.
    """

    # Ensure the directory for saving exists
    try:
        os.makedirs(os.path.dirname(filename), exist_ok=True)
    except OSError:
        return

    # Create a canvas to draw the bubble sheet
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    # Set up the positions for the bubbles and questions
    margin = 0.5 * inch
    start_x = margin
    start_y = height - margin - CANVAS_OFFSET
    question_spacing_x = 2 * inch
    question_spacing_y = 0.30 * inch
    bubble_spacing = 0.25 * inch

    current_x = start_x
    current_y = start_y

    # Draw the exam information
    draw_exam_information(
        c,
        current_x,
        current_y,
        margin=margin,
        course_name=course_name,
        exam_name=exam_name,
    )

    # Draw student identification section
    draw_student_identification(c, current_x, current_y, width)

    page = 1
    for question in range(1, num_questions + 1):
        c.setFont(FONT_BOLD, FONT_SIZE_TEXT)
        c.drawString(current_x - 10, current_y + 5, f"{question}")

        question_answers = answers[question - 1] if question - 1 < len(answers) else []

        c.setFont(FONT_NORMAL, FONT_SIZE_BUBBLE)
        for choice in range(choices_per_question):
            bubble_x = current_x + (choice + 1) * bubble_spacing

            if choice in question_answers:  # Check if the current choice is selected
                draw_bubble(c, bubble_x, current_y + 7, fill=1)
            else:
                draw_bubble(c, bubble_x, current_y + 7)
            c.drawString(bubble_x - 2.5, current_y + 4, chr(65 + choice))
        c.setFont(FONT_NORMAL, FONT_SIZE_TEXT)

        current_y -= question_spacing_y

        # Check if we need to move to a new column or page
        if question % questions_per_column == 0:
            current_y = height - margin if page > 1 else start_y
            current_x += question_spacing_x * 1
            if current_x > width - margin:
                c.showPage()
                current_x = start_x
                current_y = height - margin
                page += 1
    c.save()


def request_job(backend_url, queue_name):
    """Request a job from the backend by sending a GET request

    Args:
        backend_url (str): URL of the backend
        queue_name (str): name of the queue

    Returns:
        tuple: job_id, payload
    """
    request = requests.get(
        f"{backend_url}/{queue_name}/pick",
        headers={"x-queue-auth-token": os.getenv("API_TOKEN")},
    )

    if request.status_code == 401:
        logging.critical("Invalid API token")
        return None, None

    if request.status_code == 404:
        logging.info("No jobs available")
        return None, None

    job = request.json()

    job_id = job.get("id")

    payload = job.get("data").get("payload")
    logging.info(f"Received job #{job_id}. Payload: {payload}")

    return job_id, payload


def complete_job(backend_url, queue_name, job_id, unique_id):
    """Complete a job by sending a PATCH request to the backend

    Args:
        backend_url (str): URL of the backend
        queue_name (str): name of the queue
        job_id (int): ID of the job to complete
        unique_id (str): unique identifier to store the file in folder
    """
    requests.patch(
        f"{backend_url}/{queue_name}/{job_id}/complete",
        headers={"x-queue-auth-token": os.getenv("API_TOKEN")},
        json={"payload": {"filePath": f"{unique_id}"}},
    )

    logging.info(f"Job #{job_id} completed. Releasing it from queue")


if __name__ == "__main__":
    backend_url = os.getenv("BACKEND_URL")
    queue_name = os.getenv("QUEUE_NAME")

    while True:
        try:
            time.sleep(REQUEST_DELAY)

            job_id, payload = request_job(backend_url, queue_name)

            if not job_id or not payload:
                continue

            unique_id = uuid.uuid4()
            # Generates a bubble sheet with the answer key
            generate_bubble_sheet(
                os.path.join(f"{UPLOAD_PATH}/{unique_id}", f"answer.pdf"),
                num_questions=int(payload.get("numberOfQuestions")),
                choices_per_question=payload.get("numberOfAnswers"),
                course_name=f"{payload.get('courseCode')} {payload.get('courseName')}",
                exam_name=payload.get("examName"),
                answers=payload.get("answers"),
            )
            # Generates a blank bubble sheet that students will fill out
            generate_bubble_sheet(
                os.path.join(f"{UPLOAD_PATH}/{unique_id}", f"sheet.pdf"),
                num_questions=int(payload.get("numberOfQuestions")),
                choices_per_question=payload.get("numberOfAnswers"),
                course_name=f"{payload.get('courseCode')} {payload.get('courseName')}",
                exam_name=payload.get("examName"),
            )

            complete_job(backend_url, queue_name, job_id, unique_id)
        except requests.exceptions.RequestException:
            logging.critical("Cannot connect to the backend")
            continue
        except Exception as e:
            logging.error(f"An error occurred: {e}")
            continue
