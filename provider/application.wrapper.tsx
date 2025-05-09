import React from "react";

type Props = {
  children: React.ReactNode;
};

const ApplicationClientWrapper: React.FC<Props> = (props) => {
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default ApplicationClientWrapper;
