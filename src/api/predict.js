const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function predictLoan(applicant) {
    const response = await fetch(`${API_URL}/api/predict/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicant) // <-- values becomes JSON text
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error("Request failed");
        error.fieldErrors = data.errors || {};
        throw error;
    }

    return data;
}