import pytest
import pypdf
import os
from io import BytesIO
from bubble_sheet_generator.main import generate_bubble_sheet


@pytest.fixture
def generated_pdf():
    filename = "test_bubble_sheet.pdf"

    generate_bubble_sheet(filename)
    with open(filename, "rb") as f:
        pdf_content = f.read()
    yield pdf_content

    os.remove(filename)


def test_generate_bubble_sheet(generated_pdf):
    assert len(generated_pdf) > 0

    pdf_reader = pypdf.PdfReader(BytesIO(generated_pdf))

    text_content = ""

    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text_content += page.extract_text()

    expected_strings = [
        "EXAM ANSWER SHEET",
        "Student Name:",
        "Please follow the directions",
        "Please fill in marks like this:",
    ]

    for expected_string in expected_strings:
        assert expected_string in text_content


def test_validate_page_dimensions(generated_pdf):
    pdf_reader = pypdf.PdfReader(BytesIO(generated_pdf))

    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]

        width = page.mediabox[2] - page.mediabox[0]
        height = page.mediabox[3] - page.mediabox[1]

        assert width == 612
        assert height == 792


if __name__ == "__main__":
    pytest.main()
