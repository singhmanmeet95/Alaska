@echo off
REM Make sure Python and pandas are installed
echo Starting Delhi Metro JSON conversion...

REM Activate virtualenv or skip if global Python
REM call venv\Scripts\activate

python excel_to_json_graph.py

echo All lines converted to JSON!
pause
