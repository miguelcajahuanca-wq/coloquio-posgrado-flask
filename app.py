from flask import Flask, render_template, request, jsonify, send_file, abort
import csv
import os
from datetime import datetime

app = Flask(__name__)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)
CSV_PATH = os.path.join(DATA_DIR, "propuestas.csv")


@app.route("/")
def index():
    return render_template("index.html")


@app.post("/api/propuestas")
def api_propuestas():
    data = request.get_json(silent=True) or {}

    required = [
        "nombre",
        "email",
        "programa",
        "institucion",
        "nivel",
        "tipo",
        "idioma",
        "titulo",
        "resumen",
    ]

    missing = [field for field in required if not str(data.get(field, "")).strip()]
    if missing:
        return jsonify({
            "ok": False,
            "error": "Faltan campos obligatorios.",
            "missing": missing,
        }), 400

    timestamp = datetime.utcnow().isoformat()

    file_exists = os.path.isfile(CSV_PATH)

    with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow([
                "timestamp_utc",
                "nombre",
                "email",
                "programa",
                "institucion",
                "nivel",
                "asesor",
                "tipo",
                "idioma",
                "titulo",
                "resumen",
                "keywords",
                "comentarios",
            ])

        writer.writerow([
            timestamp,
            data.get("nombre", "").strip(),
            data.get("email", "").strip(),
            data.get("programa", "").strip(),
            data.get("institucion", "").strip(),
            data.get("nivel", "").strip(),
            data.get("asesor", "").strip(),
            data.get("tipo", "").strip(),
            data.get("idioma", "").strip(),
            data.get("titulo", "").strip(),
            data.get("resumen", "").strip().replace("\n", " "),
            data.get("keywords", "").strip(),
            data.get("comentarios", "").strip(),
        ])

    return jsonify({"ok": True}), 200


@app.route("/admin/propuestas.csv")
def descargar_propuestas():
    if not os.path.isfile(CSV_PATH):
        abort(404, description="Todavía no hay propuestas registradas.")
    return send_file(
        CSV_PATH,
        mimetype="text/csv",
        as_attachment=True,
        download_name="propuestas_coloquio.csv",
    )


if __name__ == "__main__":
    app.run(debug=True)
