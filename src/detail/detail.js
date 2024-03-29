import { useParams } from 'react-router';
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from 'react';
import styles from './detail.css';
import { mdiLoading, mdiStar, mdiStarOutline } from "@mdi/js";
import Icon from "@mdi/react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import DetailGrid from "./detailGrid.js"
import IngredientList from './ingredientList.js';

function Detail() {
  let navigate = useNavigate();
  const { id } = useParams();
  const [detailCall, setDetailCall] = useState({
    state: "pending",
  });
  const [isUpdate, setUpdate] = useState(false);
  const isCreate = id === "new"
  useEffect(() => {
    if (isCreate) {
      setDetailCall({
        state: "success",
        data: {
          name: "",
          description: "",
          portionAmount: 1,
          preparationTime: 1,
          favorite: false,
          imageUrl: "",
          ingredients: []
        }
      });
      setUpdate(true);
    }
    else {
      fetch(`https://uucoffeeapi.hudatec.cz/api/recipes/` + id, {
        method: "GET",
      }).then(async (response) => {
        const responseJson = await response.json();
        if (response.status >= 400) {
          setDetailCall({ state: "error", error: responseJson });
        } else {
          setDetailCall({ state: "success", data: responseJson });
        }
      })
    };
  }, []); // an empty condition field means that the code will run only once

  function UpdateData(value) {
    setDetailCall({ ...detailCall, data: { ...detailCall.data, ...value } })
  }

  function UpdateIngredient(id, value) {
    const newData = { ...detailCall };
    newData.data.ingredients[id] = { ...(newData.data.ingredients[id]), ...value };
    setDetailCall(newData);
  }
  function DeleteIngredient(id) {
    const newData = { ...detailCall };
    newData.data.ingredients = newData.data.ingredients.filter((data, index) => index != id);
    setDetailCall(newData);
  }

  switch (detailCall.state) {
    case "pending":
      return (
        <div className={styles.loading}>
          <Icon size={2} path={mdiLoading} spin={true} />
        </div>
      );
    case "success":
      break;

    case "error":
      return (
        <div className={styles.error}>
          <div>Failed to load class data.</div>
          <br />
          <pre>{JSON.stringify(detailCall.error, null, 2)}</pre>
        </div>
      );
    default:
      return null;
  }

  const hours = Math.floor(detailCall.data.preparationTime / 60);
  const minutes = detailCall.data.preparationTime % 60;
  function updatePrepTime(locHours, locMinutes) {
    let value = locHours * 60 + locMinutes;
    if (isNaN(value)) {
      return;
    }
    if (value < 1) {
      value = 1
    }
    UpdateData({ preparationTime: value })
  }

  function callUpdate(overrideData) {
    let uri = `https://uucoffeeapi.hudatec.cz/api/recipes`;
    if (!isCreate) {
      uri = uri + '/' + id
    }
    setDetailCall({ state: "pending" })
    fetch(uri, {
      method: isCreate ? "post" : "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...detailCall.data, ...overrideData })
    }).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400 || responseJson.error) {  //backend vrací chybu 'Recipe with name "" already exists' jako 200 tak ať mezi tim můžu pokračovat ve vývoji
        setDetailCall({ state: "error", error: responseJson });
      } else {
        if (isCreate) {
          navigate("/detail/" + responseJson.id)
        }
        setDetailCall({ state: "success", data: responseJson });
      }
    });
  }

  return (
    <>
      <Form className="row">
        <DetailGrid chidren={() => (<>
          <div className='controlledRow'>{isUpdate ?
            (<Form.Control
              required
              size="lg"
              type="text"
              value={detailCall.data.name}
              onChange={(event) => UpdateData({ name: event.target.value })}
            />) :
            (<>
              <h3 class='recipeName'>{detailCall.data.name}</h3>
              <Button
                style={{ padding: "4px", paddingTop: "1px", marginLeft: "20%" }}
                variant="outline-success"
                onClick={() => callUpdate({ favorite: !detailCall.data.favorite })}>
                <Icon size={1} path={detailCall.data.favorite ? mdiStar : mdiStarOutline} />
              </Button>
            </>)
          }

          </div>
          <div className='controlledRow'>
            <h5>Čas přípravy: {!isUpdate && hours + "h " + minutes + "m"}</h5>{isUpdate &&
              (<>
                <Form.Control
                  style={{ width: 100, height: 30 }}
                  type="number"
                  value={hours}
                  onChange={(event) => updatePrepTime(parseInt(event.target.value), minutes)
                  } />
                <h5>h </h5>
                <Form.Control
                  style={{ width: 100, height: 30 }}
                  type="number"
                  value={minutes}
                  onChange={(event) => updatePrepTime(hours, parseInt(event.target.value))
                  } />
                <h5>s</h5>
              </>
              )}</div>
          {isUpdate ?
            (<Form.Control
              required
              type="textarea"
              value={detailCall.data.description}
              onChange={(event) => UpdateData({ description: event.target.value })}
            />) :
            (<div>{detailCall.data.description}</div>)
          }
        </>)
        } />
        {/* možná bude odstraněno zítra */}
        {detailCall.data.imageUrl != "" && (<DetailGrid chidren={() => (
          <img src={detailCall.data.imageUrl} ></img >)
        } />)}
        <DetailGrid chidren={() => (
          <IngredientList
            isUpdate={isUpdate}
            ingredients={detailCall.data.ingredients}
            updateFunction={UpdateIngredient}
            deleteFunction={DeleteIngredient}
            portionAmount={detailCall.data.portionAmount}
            updatePortionAmount={(value) => UpdateData({ portionAmount: value })} />
        )
        } />
      </Form>
      <div className="buttonRow">
        {<Button className="buttonLeft" onClick={() => {
          navigate("/");
        }}>Zpět</Button>}
        <Button className="buttonRight" onClick={() => {
          if (isUpdate) {
            callUpdate();
          }
          else {
            setDetailCall({ ...detailCall, oldData: { ...detailCall.data, ingredients: [...detailCall.data.ingredients] } })
          }
          setUpdate(!isUpdate);
        }}>{isUpdate ? "Uložit" : "Upravit"}</Button>
        {(isUpdate && !isCreate) && (<Button className="buttonRight" onClick={() => {
          if (isCreate) {
            navigate("/");
          }
          else {
            setDetailCall({ ...detailCall, data: detailCall.oldData, oldData: undefined })
            setUpdate(false)
          }
        }}>Zrušit</Button>)}
        {(!isUpdate) && (<Button  className="buttonRight"
        variant="danger"
         onClick={() => {
          fetch('https://uucoffeeapi.hudatec.cz/api/recipes/' + id, {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
          },
        }).then(async (response) => {
          if (response.status >= 400) {  //backend vrací chybu 'Recipe with name "" already exists' jako 200 tak ať mezi tim můžu pokračovat ve vývoji
            const responseJson = await response.json();
            setDetailCall({ state: "error", error: responseJson });
          } else {
            navigate("/")
          }
        });
         }}>Smazat</Button>)}
      </div>
    </>
  );

}

export default Detail;