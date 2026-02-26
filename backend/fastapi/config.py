from dotenv import load_dotenv
import os

load_dotenv()

URL_DATABASE = os.getenv("URL_DATABASE")
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))