import React, { useState, useEffect } from "react";

export default function Counter() {
  // 1. Initialize count from localStorage (or fallback to 0)
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem("mon_compteur_valeur");
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("No clicks yet");
  const [totalClics, setTotalClics] = useState(() => {
    const saved = localStorage.getItem("mon_compteur_total_clics");
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  //const [historique, setHistorique] = useState([]);

  // challenge 2: read the saved history at start (JSON.parse), or empty array
  const [historique, setHistorique] = useState(() => {
    const saved = localStorage.getItem("mon_compteur_historique");
    return saved !== null ? JSON.parse(saved) : [];
  });

  // 2. EFFECT A: Synchronize browser tab title
  useEffect(() => {
    document.title = "Counter: " + count;
  }, [count]); // Re-runs strictly when `count` changes!

  // 3. EFFECT B: Automatically persist state to localStorage
  useEffect(() => {
    localStorage.setItem("mon_compteur_valeur", count.toString());
  }, [count]);

  useEffect(() => {
    localStorage.setItem("mon_compteur_total_clics", totalClics.toString());
  }, [totalClics]);

  // challenge 2: save the history each time it changes (array → text with JSON.stringify)
  useEffect(() => {
    localStorage.setItem("mon_compteur_historique", JSON.stringify(historique));
  }, [historique]);

  // Increment handler with simple variables
  const handleIncrement = () => {
    // challenge 1: block above 50
    if (count + step > 50) {
      alert("Maximum threshold of 50 reached!");
      return;
    }

    const nouveauCompte = count + step;
    setCount(nouveauCompte);
    setMessage("Added " + step);
    setTotalClics(totalClics + 1);
    const action = "+" + step;
    setHistorique([...historique, action]);
  };

  // Decrement handler
  const handleDecrement = () => {
    // challenge 1: block below -50
    if (count - step < -50) {
      alert("Minimum threshold of -50 reached!");
      return;
    }

    const nouveauCompte = count - step;
    setCount(nouveauCompte);
    setMessage("Subtracted " + step);
    setTotalClics(totalClics + 1);
    const action = "-" + step;
    setHistorique([...historique, action]);
  };

  // Reset handler
  const handleReset = () => {
    setCount(0);
    setMessage("Reset to zero");
    setTotalClics(0);
    setHistorique([]);
  };

    // challenge 3: arrow keys control the counter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") handleIncrement();
      if (e.key === "ArrowDown") handleDecrement();
    };

    window.addEventListener("keydown", handleKeyDown);

    // cleanup: remove the listener (no duplicate listeners)
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [count, step, totalClics, historique]);

  // Dynamic styling based on counter sign
  const getStyleClass = () => {
    if (count > 0) return "counter-display positive";
    if (count < 0) return "counter-display negative";
    return "counter-display zero";
  };

  return (
    <div className="counter-card">
      <div className={getStyleClass()}>{count}</div>

      <div className="btn-group">
        <button className="btn btn-dec" onClick={handleDecrement}>
          -{step}
        </button>
        <button className="btn btn-reset" onClick={handleReset}>
          Reset
        </button>
        <button className="btn btn-inc" onClick={handleIncrement}>
          +{step}
        </button>
      </div>

      <div className="step-control">
        <label>Increment Step: </label>
        <select
          value={step}
          onChange={(e) => setStep(parseInt(e.target.value, 10))}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </div>

      <div className="history-card">
        <p>
          <strong>Last Action:</strong> {message}
        </p>
        <p>
          <strong>Total Clicks:</strong> {totalClics}
        </p>
        {historique.length > 0 && (
          <p>
            <strong>History:</strong> {historique.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
