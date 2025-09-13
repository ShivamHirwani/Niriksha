import re
from werkzeug.utils import secure_filename


def validate_email(email: str, college_domain: str) -> bool:
    """
    Validate if the given email belongs to the specified college domain.

    :param email: The email address to validate.
    :param college_domain: The college domain to check against (e.g., "collegename.in").
    :return: True if email is valid and from the specified college domain, else False.
    """
    # Basic email pattern
    pattern = r'^[a-zA-Z0-9._%+-]+@' + re.escape(college_domain) + r'$'
    
    return bool(re.match(pattern, email))

def validate_password(password):
    """Validate password meets requirements"""
    return len(password) >= 8  # You can add more complex validation if needed

