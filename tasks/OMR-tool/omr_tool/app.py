from PIL.Image import Image
from omr_tool.omr_pipeline.omr_tasks import create_answer_key, mark_submission_group
from omr_tool.utils.pdf_to_images import convert_to_images
from omr_tool.utils.images_to_pdf import convert_to_pdf
from pathlib import Path
import requests
import os
from dotenv import load_dotenv
import logging
import cv2

load_dotenv()
logging.basicConfig(
    format="%(asctime)s >> %(message)s",
    datefmt="%m-%d-%Y %I:%M:%S %p",
    level=logging.INFO,
)


def request_job(backend_url, queue_name):
    # TODO: Consider moving to a shared module
    """Request a job from the backend by sending a GET request

    Args:
        backend_url (str): URL of the backend
        queue_name (str): name of the queue

    Returns:
        tuple: job_id, payload
    """
    request = requests.get(
        f"{backend_url}/queue/{queue_name}/pick",
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
    # TODO: Consider moving to a shared module
    """Complete a job by sending a PATCH request to the backend

    Args:
        backend_url (str): URL of the backend
        queue_name (str): name of the queue
        job_id (int): ID of the job to complete
        unique_id (str): unique identifier to store the file in folder
    """
    requests.patch(
        f"{backend_url}/queue/{queue_name}/{job_id}/complete",
        headers={"x-queue-auth-token": os.getenv("API_TOKEN")},
        json={"payload": {"filePath": f"{unique_id}"}},
    )

    logging.info(f"Job #{job_id} completed. Releasing it from queue")


def send_grades(backend_url, exam_id, submission_results):
    """Send grades to the backend

    Args:
        backend_url (str): URL of the backend
        exam_id (str): ID of the exam
        submission_results: A dictionary containing the following information:
            - "student_id" (str): The ID of the student.
            - "document_path" (str): The path of the document.
            - "score" (int): The total score of the submission.
            - "answers" (dict): A dictionary containing the list of answers.
                - "answer_list" (list): A list of dictionaries representing each answer.
    """

    student_id = submission_results["student_id"]

    request = requests.post(
        f"{backend_url}/exam/{exam_id}/{student_id}",
        headers={"x-worker-auth-token": os.getenv("WORKER_TOKEN")},
        data={
            "answers": submission_results["answers"],
            "score": submission_results["score"],
            "documentPath": submission_results["document_path"],
        },
    )

    if request.status_code == 401:
        logging.critical("Invalid WORKER token")

    if request.status_code == 404:
        logging.info("Exam not found for course")


def app():

    backend_url = os.getenv("BACKEND_URL")
    queue_name = os.getenv("QUEUE_NAME")

    # Receive files and exam info from the backend
    # The answer sheet and submissions will be saved in the same folder
    job_id, payload = request_job(backend_url, queue_name)
    exam_id: str = payload.get("examId")
    course_id: str = payload.get("courseId")
    answer_key_path: str = payload.get("folderName")
    submission_path: str = payload.get("folderName")

    # output path where graded submission PDFs will be saved
    sub_out_dir: str = (
        Path(__file__).resolve().parents[3]
        / "backend"
        / "uploads"
        / "exams"
        / "processed_submissions"
    )

    # Generate an answer key from the answer key PDF (Should return a dict of answers)
    # Convert the answer key PDF to list of images
    # Process each image in the list with the OMR pipeline. Should return a dict of answers
    answer_key_imgs: list[Image] = convert_to_images(answer_key_path)
    answer_key: dict = create_answer_key(answer_key_imgs)
    num_pages_in_exam: int = len(answer_key_imgs)

    # Process the submissions
    # Process each image in the list with the OMR pipeline. Should return a dict of grades and a list of combined images per user
    # (e.g. 2 pages spliced into one img per user)
    all_submission_images: list[Image] = convert_to_images(submission_path)

    for i in range(0, len(all_submission_images), num_pages_in_exam):
        # for each student
        group_images = all_submission_images[i : i + num_pages_in_exam]
        submission_results, graded_imgs = mark_submission_group(
            group_images, answer_key
        )

        # convert graded images to PDF and send "courseId_examId_studentId" file to backend (manually)
        student_id = submission_results["student_id"]
        output_pdf_path = convert_to_pdf(
            graded_imgs, sub_out_dir, f"{course_id}_{exam_id}_{student_id}"
        )
        submission_results["document_path"] = output_pdf_path

        # send grades to backend
        send_grades(backend_url, exam_id, submission_results)

        # ---

    # complete_job(backend_url, queue_name, job_id, unique_id)


if __name__ == "__main__":
    app()
