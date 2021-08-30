import React from "react";
import Header from "../header/header";
import Main from "../main/main";
import "antd/dist/antd.css";

export default function Home() {
  React.useEffect(() => {
    return function cleanUp() {
      localStorage.clear();
    };
  });
  return (
    <>
      <Header />
      <Main />
    </>
  );
}
