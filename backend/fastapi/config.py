from dotenv import load_dotenv
import os

load_dotenv()

URL_DATABASE = os.getenv("URL_DATABASE")
JWT_SECRET = os.getenv("JWT_SECRET")