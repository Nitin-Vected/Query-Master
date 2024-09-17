import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
// import { toast } from "react-toastify";
// import Spinner from "../components/Spinner";

const NewTicket: React.FC = () => {
  const [description, setDescription] = useState<string>("");

  // const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const loginResult = await axios.post(
    //   "http://localhost:3001/user/userRaiseQuery"
    //   // { userEmail:  }
    // );
  };

  return (
    <>
      <section className="section heading">
        <BackButton url="/" />
        <h1>Create New Ticket</h1>
        <p>Please fill out the form below</p>
      </section>

      <section className="form">
        <div className="form-group">
          <label htmlFor="email">User Email</label>
          <input
            type="text"
            className="form-control"
            name="email"
            id="email"
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            className="form-control"
            name="subject"
            id="subject"
          />
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="description">Description of the issue</label>
            <textarea
              name="description"
              id="description"
              className="form-control"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <button className="btn btn-block" type="submit">
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default NewTicket;
