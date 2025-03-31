import React from "react";

const AccountInfo = ({ userType }) => {
  return (
    <div>
      <h1>{userType === "employer" ? "Employer Account Info" : "Account Info"}</h1>
    </div>
  );
};

export default AccountInfo;
