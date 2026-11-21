import { useState } from "react";
import LoanForm from "./components/LoanForm";
import ResultCard from "./components/ResultCard";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-3xl font-bold text-white">Loan Approval Predictor</h1>
        
        {result ? (
          <ResultCard  result={result} onReset={() => setResult(null)} />
        ) : (
            <LoanForm onResult={setResult} />
        )}
        
      </div>
    </div>
  );
}

export default App;