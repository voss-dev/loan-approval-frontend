export default function ResultCard({ result, onReset }) {
    const approved = result.approved;
    const percent = (result.probability * 100).toFixed(1);

    return (
        <div className="rounded-lg bg-slate-800 p-6 text-center">
            <p className={`text-3xl font-bold ${approved ? "text-green-400" : "text-red-400"}`}>
                {approved ? "Likely approved" : "Likely rejected"}
            </p>
            <p className="mt-2 text-slate-300">
                Model estimated approval probability: {percent}%
            </p>
            <p  className="mt-4 text-xs text-slate-500">
                This is a demo model trained on a sample dataset. It is not financial advice.
            </p>
            <button
                onClick={onReset}
                className="mt-6 rounded bg-blue-600 px-4 py-2 text-white"
            >
                Try another application
            </button>
        </div>
    );
}