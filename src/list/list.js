import ListItems from './listItems.js'
import { useState, useMemo, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import styles from './list.css';
import { mdiLoading } from "@mdi/js";

// import { useState } from 'react';
function List(props) {
  const [plainTextFilter, setPlainTextFilter] = useState("");

  const filteredStudentList = useMemo(() => {

    return props.recipies
      .filter((item) => {
        return (
          item.name
            .toLocaleLowerCase()
            .includes(plainTextFilter.toLocaleLowerCase())
        );
      })
      .sort((item) => !item.favourite);
  }, [plainTextFilter, props.recipies]);

  // const [viewType, setViewType] = useState("grid");
  // const isGrid = viewType === "grid"; // isGrid je pomocná proměnná, kterou budeme dále používat pro řízení vzhledu

  function handleSearch(event) {
    event.preventDefault();
    setPlainTextFilter(event.target["searchInput"].value);
  }

  function handleSearchDelete(event) {
    if (!event.target.value) setPlainTextFilter("");
  }

  return <>
    <Form className="d-flex" onSubmit={handleSearch}>
      <Form.Control
        style={{ maxWidth: "400px" }}
        name="searchInput"
        type="Search"
        placeholder="Search"
        aria-label="Search"
        onChange={handleSearchDelete}
      />
      <Button style={{ marginRight: "8px" }} variant="outline-success" type="submit">
        <Icon size={1} path={mdiMagnify} />
      </Button>
      {/* <Button
        variant="outline-primary"
        onClick={() =>
          setViewType((currentState) => {
            if (currentState === "grid") return "table";
            else return "grid";
          })
        }
      >
        <Icon size={1} path={isGrid ? mdiTable : mdiViewGridOutline} />{" "}
        {isGrid ? "Tabulka" : "Grid"}
      </Button> */}
    </Form>
    <ListItems recipeList={filteredStudentList} />
  </>;
}
export default List