import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import BackButton from "../components/BackButton";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../app/authSlice";
import { createQuery } from "../utility/utility";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'


const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  subject: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

const NewQuery: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const userEmail = useSelector((state: RootState) => state.auth.userData?.email || '');
  const token = useSelector((state: RootState) => state.auth.userData?.token || ''); // Fetch token from Redux store

  const formik = useFormik({
    initialValues: {
      email: userEmail,
      subject: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      dispatch(setLoading(true));
      try {
        await createQuery(values.subject, values.description, token);
        toast.success("Query created successfully!"); 
        navigate("/queries");
      } catch (error) {
        toast.error("Failed to create query. Please try again."); 
      } finally {
        dispatch(setLoading(false));
      }
    },
  });

  return (
    <>
      <section className="section heading">
        <BackButton url="/" />
        <h1>Create New Query</h1>
        <p>Please fill out the form below</p>
      </section>

      <section className="form">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">User Email</label>
            <input
              type="text"
              className="form-control"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              className="form-control"
              name="subject"
              id="subject"
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.subject && formik.errors.subject ? (
              <div className="error">{formik.errors.subject}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="description">Description of the issue</label>
            <textarea
              name="description"
              id="description"
              className="form-control"
              placeholder="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            ></textarea>
            {formik.touched.description && formik.errors.description ? (
              <div className="error">{formik.errors.description}</div>
            ) : null}
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

export default NewQuery;
