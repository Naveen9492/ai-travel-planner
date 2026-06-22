import { RotatingLines } from "react-loader-spinner";
import "./index.css";

const Loader = () => (
  <div className="loader-container">
    <RotatingLines
      strokeColor="#a855f7"
      strokeWidth="5"
      animationDuration="0.75"
      width="60"
      visible={true}
    />
  </div>
);
export default Loader;
