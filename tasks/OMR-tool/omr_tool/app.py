from PIL.Image import Image
from omr_pipeline.omr_tasks import create_answer_key, mark_submission_page
from utils.pdf_to_images import convert_to_images
from pathlib import Path
import requests
import os
from dotenv import load_dotenv
import logging

load_dotenv()
logging.basicConfig(
    format="%(asctime)s >> %(message)s",
    datefmt="%m-%d-%Y %I:%M:%S %p",
    level=logging.INFO,
)


def process_submission_group(
    group_images: list[Image], answer_key: dict
) -> tuple[dict, list[Image]]:
    """
    Process a group of submission images and generate the corresponding results.

    Args:
        group_images (list[Image]): A list of submission images.
        answer_key (dict): The answer key for the OMR (Optical Mark Recognition) tool.

    Returns:
        tuple[dict, list[Image]]: A tuple containing the submission results and the graded images.
            - submission_results (dict): A dictionary containing the following information:
                - "student_id" (str): The ID of the student.
                - "document_path" (str): The path of the document.
                - "score" (int): The total score of the submission.
                - "answers" (dict): A dictionary containing the list of answers.
                    - "answer_list" (list): A list of dictionaries representing each answer.
            - graded_imgs (list[Image]): A list of graded images.

    """
    submission_results: dict = {
        "student_id": None,
        "document_path": None,
        "score": None,
        "answers": {"answer_list": []},
    }
    graded_imgs: list[Image] = []
    for submission_img in group_images:
        page_results, new_img = mark_submission_page(
            submission_img, answer_key)

        if page_results["student_id"] is not None:
            submission_results["student_id"] = page_results["student_id"]
        submission_results["answers"]["answer_list"].append(
            page_results["answers"])
        submission_results["score"] += page_results["score"]

        graded_imgs.append(new_img)

    return submission_results, graded_imgs


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


def app():

    backend_url = os.getenv("BACKEND_URL")
    queue_name = os.getenv("QUEUE_NAME")

    # Paula
    # Receive Files and exam info from the backend (Should be a path to the PDF answer sheet, a path to the PDF of submissions, and exam info)
    exam_id: str = "something like info.exam_id"
    course_id: str = "something like info.course_id"
    sub_out_dir: str = (
        # You may not actually need to destructure these last three
        "something like info.submission_dir (Output path where graded submission PDFs will be saved)"
    )
    answer_key_path: str = "path to the answer key PDF"
    submission_path: str = "path to the submission PDF"
    # ---

    # Generate an answer key from the answer key PDF (Should return a dict of answers)
    # Convert the answer key PDF to list of images
    # Process each image in the list with the OMR pipeline. Should return a dict of answers
    answer_key_imgs: list[Image] = convert_to_images(answer_key_path)
    answer_key: dict = create_answer_key(answer_key_imgs)
    num_pages_in_exam: int = len(answer_key_imgs)

    # Process the submissions
    # Process each image in the list with the OMR pipeline. Should return a dict of grades and a list of combined images per user
    # (e.g. 2 pages spliced into on img per user)
    all_submission_images: list[Image] = convert_to_images(submission_path)

    for i in range(0, len(all_submission_images), num_pages_in_exam):
        group_images = all_submission_images[i: i + num_pages_in_exam]
        submission_results, graded_imgs = process_submission_group(
            group_images, answer_key
        )

        # Paula

        # process the submission in list
        # find image with matching student ID in submission_images (You can find the student ID with submission_results["student_id"])
        output_pdf, output_pdf_name = convert_to_PDF(graded_imgs)
        # Put the image into its own PDF named with an identifier like a student num
        # Its own module
        send_pdf(pdf, output_pdf_name)

        submission_results["document_path"] = output_pdf_name
        # Return the new PDF to the backend (multi-PDF payload)
        send_grades(submission_results)
        # Return the single submission for this student to the backend (multi-image payload)

        # ---


if __name__ == "__main__":
    app()
