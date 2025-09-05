import psycopg2

conn = psycopg2.connect(
    dbname="Social_Security",
    user="postgres",
    password="itumeleng",  # replace with your actual password
    host="localhost",
    port="5432"
)

cur = conn.cursor()
cur.execute("SELECT 1;")
print(cur.fetchone())
conn.close()
