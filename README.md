# Data Structure Analyser

A full-stack web application to visualize and interact with various data structures. 

## Features
- **Supported Data Structures**: Array, Tuple, Linked List, Heap, Stack, Queue.
- **Interactive**: Add and remove elements from the data structures and see the changes.

## Prerequisites
- **Node.js**: v18 or higher (for the frontend).
- **Python**: 3.8 or higher (for the backend).

## Getting Started

Run the following commands from the project root directory to start both the backend and frontend simultaneously:

```bash
# 1. Setup and start the Flask backend in the background
python -m venv .venv
source .venv/bin/activate
pip install flask flask-cors
python main.py &

# 2. Setup and start the React frontend
cd frontend
npm install
npm run dev
```

The backend API will run on `http://localhost:8000` and the frontend application will be available at `http://localhost:5173`.