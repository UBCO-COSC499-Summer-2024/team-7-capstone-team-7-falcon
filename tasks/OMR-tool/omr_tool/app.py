from PIL.Image import Image
from omr_tool.omr_pipeline.omr_tasks import create_answer_key, process_submission_group
from omr_tool.utils.pdf_to_images import convert_to_images


def app():
    # Paula
    # Receive Files and exam info from the backend (Should be a path to the PDF answer sheet, a path to the PDF of submissions, and exam info)
    exam_id: str = "something like info.exam_id"
    course_id: str = "something like info.course_id"
    sub_out_dir: str = (
        "something like info.submission_dir (Output path where graded submission PDFs will be saved)"  # You may not actually need to destructure these last three
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
        group_images = all_submission_images[i : i + num_pages_in_exam]
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
