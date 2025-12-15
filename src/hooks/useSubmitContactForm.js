// src/hooks/useSubmitForm.js
import { useState } from "react";
import axios from "axios";

const useSubmitContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const submitForm = async (url, data) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const { data: json } = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setResponse(json);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Submission failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading, response, error };
};

export default useSubmitContactForm;
