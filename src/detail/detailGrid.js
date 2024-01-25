import styles from "./detail.css"

function DetailGrid(props) {
  return (
    <div
      className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 detailGrid"
      style={{ }}
    >
      {props.chidren()}
    </div>
  );
}
export default DetailGrid;