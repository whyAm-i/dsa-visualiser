from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATA_STRUCTURES = {
    "array": [10, 25, 30, 45, 50],
    "tuple": [5, 15, 25, 35, 45],
    "linkedlist": [
        {"id": 0, "value": 10, "next": 1},
        {"id": 1, "value": 20, "next": 2},
        {"id": 2, "value": 30, "next": 3},
        {"id": 3, "value": 40, "next": None}
    ],
    "heap": [100, 50, 40, 30, 20, 10, 5],
    "stack": [10, 20, 30, 40, 50],
    "queue": [10, 20, 30, 40, 50]
}

@app.route("/api/<ds_name>", methods=["GET"])
def get_ds(ds_name):
    if ds_name in DATA_STRUCTURES:
        return jsonify({"name": ds_name, "data": DATA_STRUCTURES[ds_name]})
    return jsonify({"error": "Not found"}), 404

@app.route("/api/<ds_name>/add", methods=["POST"])
def add_element(ds_name):
    if ds_name not in DATA_STRUCTURES:
        return jsonify({"error": "Not found"}), 404
        
    data = request.json
    if not data or "value" not in data:
        return jsonify({"error": "Value is required"}), 400
        
    try:
        val = int(data["value"])
    except ValueError:
        return jsonify({"error": "Value must be an integer"}), 400

    ds = DATA_STRUCTURES[ds_name]
    
    if ds_name == "linkedlist":
        new_id = len(ds)
        if len(ds) > 0:
            ds[-1]["next"] = new_id
        ds.append({"id": new_id, "value": val, "next": None})
    elif ds_name == "heap":
        # Max heap insert
        ds.append(val)
        i = len(ds) - 1
        while i > 0:
            parent = (i - 1) // 2
            if ds[i] > ds[parent]:
                ds[i], ds[parent] = ds[parent], ds[i]
                i = parent
            else:
                break
    else:
        # Array, Tuple (mocked), Stack, Queue
        ds.append(val)
        
    return jsonify({"success": True, "name": ds_name, "data": ds})

@app.route("/api/<ds_name>/remove", methods=["POST"])
def remove_element(ds_name):
    if ds_name not in DATA_STRUCTURES:
        return jsonify({"error": "Not found"}), 404
        
    ds = DATA_STRUCTURES[ds_name]
    if len(ds) == 0:
        return jsonify({"error": "Data structure is empty"}), 400

    if ds_name == "linkedlist":
        ds.pop()
        if len(ds) > 0:
            ds[-1]["next"] = None
    elif ds_name == "heap":
        if len(ds) == 1:
            ds.pop()
        else:
            ds[0] = ds.pop()
            i = 0
            while True:
                left = 2 * i + 1
                right = 2 * i + 2
                largest = i
                if left < len(ds) and ds[left] > ds[largest]:
                    largest = left
                if right < len(ds) and ds[right] > ds[largest]:
                    largest = right
                if largest == i:
                    break
                ds[i], ds[largest] = ds[largest], ds[i]
                i = largest
    elif ds_name == "queue":
        ds.pop(0)
    else:
        # Array, Tuple (mocked), Stack
        ds.pop()
        
    return jsonify({"success": True, "name": ds_name, "data": ds})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)