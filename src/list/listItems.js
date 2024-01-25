import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/esm/Button";
import { Outlet, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiStar } from "@mdi/js";


function Listitems(props) {
  let navigate = useNavigate();
  return (
    <Table>
      <thead>
        <tr>
          <th>Název</th>
          <th>Čas přípravy</th>
          <th>Oblíbený recept</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.recipeList.map((recipe) => {
          //format prep time
          let prepTimeString = ""; 
          let prepMins = recipe.preparationTime
          if(prepMins > 59)
          {
            prepTimeString = (Math.floor(recipe.preparationTime / 60)) + " h ";
            prepMins = prepMins % 60;
          }
          prepTimeString = prepTimeString + prepMins + " m"
          
          return (
            <tr key={recipe.id}>
              <td>{recipe.name}</td>
              <td>{prepTimeString}</td>
              <td>{recipe.favorite && (<Icon size={1} path={mdiStar} />)}</td>
              <td>
                <Button
                  style={{ marginRight: "8px" }}
                  variant="outline-success"
                  onClick={() => navigate("/detail/" + recipe.id)}
                >
                  Detail receptu
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );;
}
export default Listitems