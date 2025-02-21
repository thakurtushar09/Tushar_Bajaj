import { useState } from "react";
import Select from "react-select";

export default function MultiFilterComponent() {
  const [input, setInput] = useState('{"data":["M","1","334","4","B"]}');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);

  const filterOptions = [
    { value: "numbers", label: "Numbers" },
    { value: "highest_alphabet", label: "Highest Alphabet" }
  ];

  const handleSubmit = async () => {
    try {
      setError(null); 
      const parsedData = JSON.parse(input);

      const response = await fetch("http://localhost:3000/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      const result = await response.json();
      setApiResponse(result);
    } catch (error) {
      setError("Invalid JSON input or API error.");
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto border rounded-xl shadow-md bg-white">
      <label className="block text-gray-700 font-bold mb-2">API Input</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="w-full bg-blue-600 text-white p-2 rounded mb-4" onClick={handleSubmit}>
        Submit
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {apiResponse && (
        <>
          <label className="block text-gray-700 font-bold mb-2">Multi Filter</label>
          <Select
            isMulti
            options={filterOptions}
            className="mb-4"
            onChange={setSelectedFilters}
          />

          <div className="border p-4 rounded bg-gray-100">
            <h3 className="font-bold mb-2">API Response</h3>
            {selectedFilters.some(f => f.value === "numbers") && (
              <p>Numbers: {apiResponse.numbers.join(", ")}</p>
            )}
            {selectedFilters.some(f => f.value === "highest_alphabet") && (
              <p>Highest Alphabet: {apiResponse.highest_alphabet[0]}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
