import subprocess

try:
    result = subprocess.run(["alembic", "upgrade", "head"], capture_output=True, text=True, check=True)
    with open("alembic_output.txt", "w") as f:
        f.write("STDOUT:\n")
        f.write(result.stdout)
        f.write("\nSTDERR:\n")
        f.write(result.stderr)
    print("SUCCESS")
except subprocess.CalledProcessError as e:
    with open("alembic_output.txt", "w") as f:
        f.write("FAILED WITH CODE: " + str(e.returncode) + "\n")
        f.write("STDOUT:\n")
        f.write(e.stdout)
        f.write("\nSTDERR:\n")
        f.write(e.stderr)
    print("FAILED")
except Exception as e:
    with open("alembic_output.txt", "w") as f:
        f.write(str(e))
    print("EXCEPTION")
