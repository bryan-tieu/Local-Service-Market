import React from "react";

const Messages = ({ userType }) => {
  return (
    <div>
      <h1>{userType === "employer" ? "Employer Messages" : "Messages"}</h1>
    </div>
  );
};

export default Messages;