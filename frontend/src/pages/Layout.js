import { Outlet } from "react-router-dom";
import Nav from "../components/nav";

export default function Layout(props) {
    return (
      <>
        <Nav {...props} />
        <div id="main">
            <Outlet />
        </div>
        {/* <Footer /> */}
      </>
    );
  }