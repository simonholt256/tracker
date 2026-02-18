venv\Scripts\Activate
pip install -r requirements.txt

python -m uvicorn main:app





next i'm going to make a sign in end point, hopefully with jwt tokens, then i can have a go on some front end stuff


things to keep in mind, 

- general secrurity, the link to my db with password is visable in code. 

- want to add a migration thing between fatsapi and database, Alembic seems to be the key one.