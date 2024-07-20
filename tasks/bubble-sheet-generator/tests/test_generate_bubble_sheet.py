import pytest
import pypdf
import os
from io import BytesIO
from bubble_sheet_generator.main import generate_bubble_sheet, request_job, complete_job
from unittest import mock

UPLOAD_PATH = os.path.join(os.path.dirname(__file__))


@pytest.fixture
def generated_pdf():
    filename = f"{UPLOAD_PATH}/test_bubble_sheet.pdf"

    generate_bubble_sheet(filename)
    with open(filename, "rb") as f:
        pdf_content = f.read()
    yield pdf_content

    os.remove(filename)


@pytest.fixture
def mock_requests_get_200():
    mock_response = mock.Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"id": 123, "data": {"payload": "test_payload"}}
    with mock.patch("requests.get", return_value=mock_response) as mock_get:
        yield mock_get


@pytest.fixture
def mock_requests_get_401():
    mock_response = mock.Mock()
    mock_response.status_code = 401
    with mock.patch("requests.get", return_value=mock_response) as mock_get:
        yield mock_get


@pytest.fixture
def mock_requests_get_404():
    mock_response = mock.Mock()
    mock_response.status_code = 404
    with mock.patch("requests.get", return_value=mock_response) as mock_get:
        yield mock_get


@pytest.fixture
def mock_requests_patch():
    with mock.patch("requests.patch") as mock_patch:
        yield mock_patch


def test_request_job_successful(mock_requests_get_200, mock_requests_patch):
    backend_url = "http://example.com"
    queue_name = "test_queue"
    os.environ["API_TOKEN"] = "test_token"

    job_id, payload = request_job(backend_url, queue_name)

    assert job_id == 123
    assert payload == "test_payload"
    mock_requests_get_200.assert_called_once_with(
        f"{backend_url}/{queue_name}/pick", headers={"x-queue-auth-token": "test_token"}
    )
    mock_requests_patch.assert_not_called()


def test_request_job_invalid_token(mock_requests_get_401, mock_requests_patch, caplog):
    backend_url = "http://example.com"
    queue_name = "test_queue"
    os.environ["API_TOKEN"] = "invalid_token"

    job_id, payload = request_job(backend_url, queue_name)

    assert job_id is None
    assert payload is None
    assert "Invalid API token" in caplog.text
    mock_requests_get_401.assert_called_once_with(
        f"{backend_url}/{queue_name}/pick",
        headers={"x-queue-auth-token": "invalid_token"},
    )
    mock_requests_patch.assert_not_called()


def test_request_job_no_jobs(mock_requests_get_404, mock_requests_patch):
    backend_url = "http://example.com"
    queue_name = "test_queue"
    os.environ["API_TOKEN"] = "test_token"

    job_id, payload = request_job(backend_url, queue_name)

    assert job_id is None
    assert payload is None

    mock_requests_get_404.assert_called_once_with(
        f"{backend_url}/{queue_name}/pick", headers={"x-queue-auth-token": "test_token"}
    )
    mock_requests_patch.assert_not_called()


def test_complete_job(mock_requests_patch):
    backend_url = "http://example.com"
    queue_name = "test_queue"
    job_id = 123
    unique_id = "test_unique_id"
    os.environ["API_TOKEN"] = "test_token"

    complete_job(backend_url, queue_name, job_id, unique_id)

    mock_requests_patch.assert_called_once_with(
        f"{backend_url}/{queue_name}/{job_id}/complete",
        headers={"x-queue-auth-token": "test_token"},
        json={"payload": {"filePath": "test_unique_id"}},
    )


def test_generate_bubble_sheet(generated_pdf):
    assert len(generated_pdf) > 0

    pdf_reader = pypdf.PdfReader(BytesIO(generated_pdf))

    text_content = ""

    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text_content += page.extract_text()

    expected_strings = [
        "Default exam\n",
        "Default course\n",
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
