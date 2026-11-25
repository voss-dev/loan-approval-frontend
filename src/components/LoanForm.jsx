import { useState } from "react";
import { predictLoan } from "../api/predict";

// An array with JavaScript objects
const NUMERIC_FIELDS = [
    { name: "person_age", label: "Age", min: 18, step: 1 },
    { name: "person_income", label: "Annual income", min: 0, step: "any" },
    { name: "person_emp_exp", label: "Years of employment", min: 0, step: 1 },
    { name: "loan_amnt", label: "Loan amount", min: 0, step: "any" },
    { name: "loan_int_rate", label: "Interest rate (%)", min: 0, max: 100, step: 0.01 },
    { name: "loan_percent_income", label: "Loan as share of income (0 to 1)", min: 0, max: 1, step: 0.01 },
    { name: "cb_person_cred_hist_length", label: "Credit history (years)", min: 0, step: 1 },
    { name: "credit_score", label: "Credit score", min: 300, max: 850, step: 1 },
]

// Adding 5 dropdowns and number conversions 
// The values must match serializer exactly in the backend

const SELECT_FIELDS = [
    { name: "person_gender", label: "Gender", options: ["female", "male"] },
    { name: "person_education", label: "Education", options: ["Associate", "Bachelor", "Doctorate", "High School", "Master"] },
    { name: "person_home_ownership", label: "Home ownership", options: ["MORTGAGE", "OTHER", "OWN", "RENT"] },
    { name: "loan_intent", label: "Loan purpose", options: ["DEBTCONSOLIDATION", "EDUCATION", "HOMEIMPROVEMENT", "MEDICAL", "PERSONAL", "VENTURE"] },
    { name: "previous_loan_defaults_on_file", label: "Previous loan default on file", options: ["No", "Yes"] },
]

export default function LoanForm({ onResult }) {
    const [values, setValues] = useState({});
    // setErrors - When Django says something is wrong
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [slow, setSlow] = useState(false); // slow is true only when the request has bee running longer than 5 seconds

    function handleChange(e) {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true); // Button becomes "Checking ..." and disabled

        // setTimeout runs a function once after a delay, here 5000 milliseconds
        // If the request arrives sooner, we cancel it
        // So after 5 seconds, slow = true
        // Check the finally block
        const slowTimer = setTimeout(() => setSlow(true), 5000);



        setErrors({});  // Clear old errors
        onResult(null);

        // Convert numeric text fields into real numbers before sending to Django
        const payload = { ...values };

        NUMERIC_FIELDS.forEach((f) => {
            if (payload[f.name] !== undefined && payload[f.name] !== "") {
                payload[f.name] = Number(payload[f.name]); // Conversion
            }
        });


        // Trying to send the form data to Django
        try {
            // Receiving the JSON from the backend
            const result = await predictLoan(payload);
            // LoanForm is saying: "Parent, here is Django's answer, you display it."
            onResult(result); // passes that object to the parent component
        } catch (err) {
            setErrors(err.fieldErrors || { form: ["Could not reach the server."] })
        } finally {
            clearTimeout(slowTimer); // Cancels the 5-second timer if Django replied before the 5 seconds
            setSlow(false); // Ensures the message disappears after every request
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {NUMERIC_FIELDS.map((f) => (
                <div key={f.name}>
                    <label className="block text-sm text-slate-300">{f.label}</label>
                    <input 
                        type="number" 
                        name={f.name} 
                        min={f.min} 
                        max={f.max} 
                        step={f.step}
                        value={values[f.name] ?? ""}
                        onChange={handleChange}
                        className="w-full rounded bg-slate-800 p-2 text-white"
                    />
                    {/* Shows "Age must be at least 18." under Age */}
                    {errors[f.name] && <p className="text-sm text-red-400">{errors[f.name][0]}</p>}
                </div>
            ))}
            {SELECT_FIELDS.map((f) => (
                <div key={f.name}>
                    <label className="block text-sm text-slate-300">{f.label}</label>
                    <select 
                        name={f.name} 
                        value={values[f.name] || ""}
                        onChange={handleChange}
                        className="w-full rounded bg-slate-800 p-2 text-white"
                    >

                        <option value="">Select...</option>
                        {f.options.map((o) => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                    </select>
                    {errors[f.name] && <p className="text-sm text-red-400">{errors[f.name][0]}</p>}
                </div>
            ))}
            {errors.form && <p className="text-red-400">{errors.form[0]}</p>}
            <button disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white">
                {loading ? "Checking..." : "Check my application"}
            </button>
            {loading && slow && (
                <p className="text-sm text-amber-300">
                    Waking up the server. On the free tier this can take up to a minute.
                </p>
            )}

        </form>
    );
}