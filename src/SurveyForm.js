import React, { useState } from "react";
import "./SurveyForm.css";

const SurveyForm = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState({
    State: "",
    Account_length: "",
    International_plan: "",
    Voice_mail_plan: "",
    Number_vmail_messages: "",
    Total_day_minutes: "",
    Total_day_calls: "",
    Total_eve_minutes: "",
    Total_eve_calls: "",
    Total_night_minutes: "",
    Total_night_calls: "",
    Total_intl_minutes: "",
    Total_intl_calls: "",
    Customer_service_calls: "",
  });

  const [errors, setErrors] = useState({});
  const [predictionResult, setPredictionResult] = useState(null);

  const tabs = [
    {
      label: "State",
      name: "State",
      placeholder: "Enter state (e.g., AL, TX)",
      validate: (value) => /^[A-Z]{2}$/.test(value),
    },
    {
      label: "Account Length",
      name: "Account_length",
      placeholder: "Enter account length",
      validate: (value) => /^\d+$/.test(value),
    },
    {
      label: "International Plan",
      name: "International_plan",
      placeholder: "Yes / No",
      validate: (value) => /^(Yes|No)$/.test(value),
    },
    {
      label: "Voice Mail Plan",
      name: "Voice_mail_plan",
      placeholder: "Yes / No",
      validate: (value) => /^(Yes|No)$/.test(value),
    },
    {
      label: "Number of Voice Mail Messages",
      name: "Number_vmail_messages",
      placeholder: "Enter number",
      validate: (value) => /^\d+$/.test(value),
    },
    {
      label: "Total Day Minutes",
      name: "Total_day_minutes",
      placeholder: "Enter minutes",
      validate: (value) => /^\d+(\.\d+)?$/.test(value),
    },
    {
      label: "Total Day Calls",
      name: "Total_day_calls",
      placeholder: "Enter calls",
      validate: (value) => /^\d+$/.test(value),
    },
    {
      label: "Total Evening Minutes",
      name: "Total_eve_minutes",
      placeholder: "Enter minutes",
      validate: (value) => /^\d+(\.\d+)?$/.test(value),
    },
    {
      label: "Total Evening Calls",
      name: "Total_eve_calls",
      placeholder: "Enter calls",
      validate: (value) => /^\d+$/.test(value),
    },
    {
      label: "Total Night Minutes",
      name: "Total_night_minutes",
      placeholder: "Enter minutes",
      validate: (value) => /^\d+(\.\d+)?$/.test(value),
    },
    {
      label: "Total Night Calls",
      name: "Total_night_calls",
      placeholder: "Enter calls",
      validate: (value) => /^\d+$/.test(value),
    },
    {
      label: "Total International Minutes",
      name: "Total_intl_minutes",
      placeholder: "Enter minutes",
      validate: (value) => /^\d+(\.\d+)?$/.test(value),
    },
    {
      label: "Total International Calls",
      name: "Total_intl_calls",
      placeholder: "Enter calls",
      validate: (value) => /^\d+$/.test(value),
    },
    {
      label: "Customer Service Calls",
      name: "Customer_service_calls",
      placeholder: "Enter calls",
      validate: (value) => /^\d+$/.test(value),
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const currentField = tabs[currentTab];
    const value = formData[currentField.name];
    const isValid = currentField.validate(value);

    if (!isValid) {
      setErrors({
        ...errors,
        [currentField.name]: `${currentField.label} is invalid. Please enter a valid value.`,
      });
      return false;
    }
    return true;
  };

  const nextPrev = (step) => {
    if (step === 1 && !validateForm()) return;
    setCurrentTab((prev) => prev + step);
  };

  const handleSubmit = async (e) => {
    const allValid = tabs.every((field) =>
      field.validate(formData[field.name])
    );
    if (!allValid) {
      alert("Please fill all fields correctly.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setPredictionResult(data.prediction);
        alert(`Prediction: ${data.prediction}`);
        // Reset the form
        setFormData({
          State: "",
          Account_length: "",
          International_plan: "",
          Voice_mail_plan: "",
          Number_vmail_messages: "",
          Total_day_minutes: "",
          Total_day_calls: "",
          Total_eve_minutes: "",
          Total_eve_calls: "",
          Total_night_minutes: "",
          Total_night_calls: "",
          Total_intl_minutes: "",
          Total_intl_calls: "",
          Customer_service_calls: "",
        });

        // Reset errors and prediction result state
        setErrors({});
        setPredictionResult(null);
      } else {
        throw new Error("Failed to get prediction");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setPredictionResult("Error occurred while predicting.");
    }
  };

  const renderTab = () => {
    const currentField = tabs[currentTab];
    return (
      <div className="tab">
        <h6>{currentField.label}</h6>
        <input
          type="text"
          placeholder={currentField.placeholder}
          name={currentField.name}
          value={formData[currentField.name]}
          onChange={handleInputChange}
          required
        />
        {errors[currentField.name] && (
          <p className="error">{errors[currentField.name]}</p>
        )}
      </div>
    );
  };

  const renderStepIndicators = () => {
    return (
      <div className="all-steps" id="all-steps">
        {tabs.map((tab, index) => (
          <span
            key={index}
            className={`step ${index === currentTab ? "active" : ""} ${
              index < currentTab ? "finish" : ""
            }`}
          >
            <i className={`fa fa-${tab.name.toLowerCase().replace("_", "-")}`}></i>
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-md-8">
          <form id="regForm">
            <h1 id="register">Churn Prediction Form</h1>

            {renderStepIndicators()}

            {renderTab()}

            {predictionResult && <h3>Prediction: {predictionResult}</h3>}

            <div style={{ overflow: "auto" }} id="nextprevious">
  <div style={{ float: "right" }}>
    {currentTab > 0 && (
      <button
        type="button"
        id="prevBtn"
        onClick={() => nextPrev(-1)}
        className="btn btn-circle"
      >
        <i className="fa fa-angle-left"></i>
      </button>
    )}
    {currentTab < tabs.length - 1 && (
      <button
        type="button"
        id="nextBtn"
        onClick={() => nextPrev(1)}
        className="btn btn-circle"
      >
        <i className="fa fa-angle-right"></i>
      </button>
    )}
    {currentTab === tabs.length - 1 && (
      <button
        type="button"
        id="submitBtn"
        onClick={handleSubmit}
        className="btn btn-circle"
      >
        Submit
      </button>
    )}
  </div>
</div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;
