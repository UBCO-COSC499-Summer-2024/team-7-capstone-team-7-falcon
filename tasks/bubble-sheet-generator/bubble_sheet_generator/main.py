from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas


FONT_BOLD = "Helvetica-Bold"
FONT_NORMAL = "Helvetica"
CANVAS_OFFSET = 200
FONT_SIZE_HEADER = 12
FONT_SIZE_TEXT = 8


def draw_bubble(canvas, x, y, radius=6, fill=0):
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


def draw_exam_information(c, current_x, current_y, margin=0.5 * inch):
    """Draw the exam information on the canvas

    Args:
        c (reportlab.pdfgen.canvas.Canvas): Canvas object to draw on
        current_x (int): horizontal position to start drawing
        current_y (int): vertical position to start drawing
        margin (int, optional): left margin of the canvas
    """
    c.setFont(FONT_BOLD, FONT_SIZE_HEADER)
    c.drawString(current_x, current_y + CANVAS_OFFSET, "EXAM ANSWER SHEET")
    c.setFont(FONT_NORMAL, FONT_SIZE_TEXT)
    c.drawString(current_x, current_y + CANVAS_OFFSET - 30, f"Student Name: {'_' * 30}")
    c.setFont(FONT_BOLD, FONT_SIZE_TEXT)
    c.drawString(current_x, current_y + CANVAS_OFFSET - 60, "Instructions:")

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
        current_x, current_y + CANVAS_OFFSET - 130, "Please fill in marks like this:"
    )
    draw_bubble(c, current_x + 120, current_y + CANVAS_OFFSET - 128, fill=1)


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
    filename, num_questions=100, choices_per_question=5, questions_per_column=25
):
    """Generate a bubble sheet PDF file

    Args:
        filename (string): name of the PDF file to generate
        num_questions (int, optional): number of questions in the exam. Defaults to 100.
        choices_per_question (int, optional): number of choices per question. Defaults to 5.
        questions_per_column (int, optional): number of questions per column. Defaults to 25.
    """

    # Create a canvas to draw the bubble sheet
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    # Set up the positions for the bubbles and questions
    margin = 0.5 * inch
    start_x = margin
    start_y = height - margin - CANVAS_OFFSET
    question_spacing_x = 2 * inch
    question_spacing_y = 0.3 * inch
    bubble_spacing = 0.3 * inch

    current_x = start_x
    current_y = start_y

    # Draw the exam information
    draw_exam_information(c, current_x, current_y, margin=margin)

    # Draw student identification section
    draw_student_identification(c, current_x, current_y, width)

    page = 1
    for question in range(1, num_questions + 1):
        c.setFont(FONT_BOLD, FONT_SIZE_TEXT)
        c.drawString(current_x - 1, current_y + 5, f"{question}")
        c.setFont(FONT_NORMAL, FONT_SIZE_TEXT)
        for choice in range(choices_per_question):
            bubble_x = current_x + (choice + 1) * bubble_spacing
            draw_bubble(c, bubble_x, current_y + 7)
            c.drawString(bubble_x - 2.5, current_y + 4, chr(65 + choice))
        current_y -= question_spacing_y

        if question % questions_per_column == 0:
            current_y = height - margin if page > 1 else start_y
            current_x += question_spacing_x * 1
            if current_x > width - margin:
                c.showPage()
                current_x = start_x
                current_y = height - margin
                page += 1
    c.save()


if __name__ == "__main__":
    # TODO: Function needs to be wrapped with a method that makes requests to backend server and saves the file to correct location
    generate_bubble_sheet("bubble_sheet.pdf")
