def omr_tool():
    # Receive Files and exam info from the backend (Should be a PDF answer sheet, a PDF of submissions, and exam info)
    exam_id = "something like info.exam_id"
    sub_out_dir = "something like info.submission_dir (Output path where graded submission PDFs will be saved)"
    # Check if the file is a PDF

    # Convert the PDF to list of images

    # Process each image in the list with the OMR pipeline. Should return a dict of grades and a list of combined images per user 
    # (e.g. 2 pages spliced into on img per user) 
    submission_grades = {"exam_id": exam_id,
              "sub_img_dir": sub_out_dir,
              "submissions": []}
    submission_images = []

    # Put each image into its own PDF named with an identifier like a student num

    # Return the exam results to the backend (json payload created from submission_grades)

    # Return the new PDFs to the backend (multi-PDF payload)

    pass


if __name__ == "__main__":
    omr_tool()
