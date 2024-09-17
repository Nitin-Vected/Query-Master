import React from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

interface BackButtonProps {
  url: string;
}

const BackButton: React.FC<BackButtonProps> = ({ url }) => {
  return (
    <Link to={url} className="btn btn-reverse btn-back">
      <FaArrowCircleLeft /> Back
    </Link>
  );
};

export default BackButton;
